import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { init } from '@/app';
import { cleanDb, generateValidToken } from '../helpers';
import { faker } from '@faker-js/faker';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from "bcrypt"
import { createBillingAddress, createUser } from '../factories/user.factory';
import jwt from "jsonwebtoken"
import { createBillingAddressSchema } from '@/schemas/protocols';

const prisma = new PrismaClient()

beforeAll(async () => {
    await init();
    await cleanDb();
  });

const server = supertest(app);

describe("POST /auth/sign-up", () => {

  it('should respond with status 400 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()] : [faker.lorem.word()] };

    const response = await server.post('/auth/sign-up').send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

   it('should respond with status 409 if there is already a user for given email', async () => {
    const email = faker.internet.email();
    createUser()
    const body = {
        email,
        password: faker.internet.password(6),
        name: faker.person.fullName()
      }

      const response = await server.post('/auth/sign-up').send(body);

      expect(response.status).toBe(httpStatus.CONFLICT);
    });

    it('should return 201 when the email is available and the password is correct', async () => {
      const email = faker.internet.email();
      const password = faker.internet.password();
      const name = faker.person.fullName();
      const body = {
        email,
        password,
        name
      }
      const response = await server.post('/auth/sign-up').send(body)
      expect(response.status).toBe(httpStatus.CREATED)
    })
    

})

describe("POST /auth/sign-in", () => {

    it('should respond with status 400 when body is not valid', async () => {
    const invalidBody = { [faker.lorem.word()] : [faker.lorem.word()] };

    const response = await server.post('/auth/sign-up').send(invalidBody);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });


    it('should respond with status 401 if there is no user for given email', async () => {
      const body = {
        email: faker.internet.email(),
        password: faker.internet.password()
      }

      const response = await server.post('/auth/sign-in').send(body);

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

  it('should respond with status 401 if there is a user for given email but password is not correct', async () => {
      const user = await createUser();
      const body = {
        email: user.email,
        password: user.password,
        name: user.name
      }

      const response = await server.post('/auth/sign-in').send({
        ...body,
        password: faker.lorem.word(),
      });

      expect(response.status).toBe(httpStatus.UNAUTHORIZED);
    });

    describe("when credentials are valid", () => {
      
      it("should respond with status 200", async () => {
      const user = await createUser();

      const body = {
        email: user.email,
        password: user.password
      }

      const response = await server.post('/auth/sign-in').send(body);
      expect(response.status).toBe(httpStatus.OK)
      })

       it('should respond with session token', async () => {
        const user = await createUser();
      const body = {
        email: user.email,
        password: user.password
      }
  

        const response = await server.post('/auth/sign-in').send(body);

        expect(response.body.token).toBeDefined();
      });



    })
})

describe("Create billing address", () => {

  it("should return status:unauthorized if no token is given", async () => {
    const response = await server.post('/auth/billing');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  })

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/auth/billing').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/auth/billing').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 400 when body is not present', async () => {
    const token = await generateValidToken();
    const response = await server.post('/auth/billing').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when body is not valid', async () => {
    const token = await generateValidToken();
    const body = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post('/auth/billing').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 201 and create new billing address', async () => {
    const user = await createUser()
    const token = await generateValidToken(user);
    const body: Omit<createBillingAddressSchema, "userId"> = {
      addresstype: "xx",
      country: faker.location.country(),
      state: faker.location.state(),
      city: faker.location.city(),
      zipcode: faker.number.bigInt().toString(),
      street: "Test Street",
      number: faker.number.int().toString(),
      complemento: "Apt 44",
    }


    const response = await server.post('/auth/billing').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.OK);
    const billing = await prisma.billingAddress.findFirst({
      where:{
        userId: user.id,
        addresstype: "xx",
        country: faker.location.country(),
        state: faker.location.state(),
        city: faker.location.city(),
        zipcode: faker.number.bigInt().toString(),
        street: "Test Street",
        number: faker.number.int().toString(),
        complemento: "Apt 44",
      }
    })
    expect(billing).toBeDefined();
  });
})

describe("Get billing address", () => {
  it("should return status:unauthorized if no token is given", async () => {
    const response = await server.get('/auth/billing');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  })

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/auth/billing').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/auth/billing').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 204 when there is no billing address for given user', async () => {
    const token = await generateValidToken();

    const response = await server.get('/auth/billing').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NO_CONTENT);
  });

  it('should respond with status 200 and enrollment data with address when there is a enrollment for given user', async () => {
    const user = await createUser();
    const billing = await createBillingAddress(user.id)
    const token = await generateValidToken(user);

    const response = await server.get('/auth/billing').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(billing);
  });

})

describe("Update billing address", () => {
  it("should return status:unauthorized if no token is given", async () => {
    const response = await server.put('/auth/billing/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  })

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.put('/auth/billing/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.put('/auth/billing/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 when there is no billing address for given user', async () => {
    const token = await generateValidToken();

    const response = await server.put('/auth/billing/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should return an empty array when the id is invalid', async () => {
    const user = await createUser();
    const billing = await createBillingAddress(user.id)
    const token = await generateValidToken(user);

    const response = await server
          .put(`/booking/0`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            addresstype: "xx",
            country: faker.location.country(),
            state: faker.location.state(),
            city: faker.location.city(),
            zipcode: faker.number.bigInt().toString(),
            street: "Test Street",
            number: faker.number.int().toString(),
            complemento: "Apt 44",
          });
  
        expect(response.body).toHaveLength(0);
  })

  it('should return status 200 when the id is valid', async () => {
    const user = await createUser();
    const billing = await createBillingAddress(user.id)
    const token = await generateValidToken(user);

    const response = await server
          .put(`/booking/${billing.id}`)
          .set('Authorization', `Bearer ${token}`)
          .send({
            addresstype: "xx",
            country: faker.location.country(),
            state: faker.location.state(),
            city: faker.location.city(),
            zipcode: faker.number.bigInt().toString(),
            street: "Test Street",
            number: faker.number.int().toString(),
            complemento: "Apt 44",
          });
  
        expect(response.body).toHaveLength(1);
  })
})

describe("DELETE billing address", () => {
  it("should return status:unauthorized if no token is given", async () => {
    const response = await server.delete('/auth/billing/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  })

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.delete('/auth/billing/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.delete('/auth/billing/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 when there is no billing address for given user', async () => {
    const token = await generateValidToken();

    const response = await server.delete('/auth/billing/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.NOT_FOUND);
  });

  it('should return status 404 when the id is invalid', async () => {
    const user = await createUser();
    const billing = await createBillingAddress(user.id)
    const token = await generateValidToken(user);

    const response = await server
          .delete(`/auth/billing/0`)
          .set('Authorization', `Bearer ${token}`);
  
          expect(response.status).toBe(404)
  })

  it('should return status 200 when the id is valid', async () => {
    const user = await createUser();
    const billing = await createBillingAddress(user.id)
    const token = await generateValidToken(user);

    const response = await server
          .delete(`/auth/billing/${billing.id}`)
          .set('Authorization', `Bearer ${token}`)
          ;
  
        expect(response.status).toBe(200)
  })
})

describe("POST /auth/changepassword", () => {
  it("should return status:unauthorized if no token is given", async () => {
    const response = await server.post('/auth/changepassword');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  })

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/auth/changepassword').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/auth/changepassword').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 400 when body is not present', async () => {
    const token = await generateValidToken();
    const response = await server.post('/auth/changepassword').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 400 when body is not valid', async () => {
    const token = await generateValidToken();
    const body = { [faker.lorem.word()]: faker.lorem.word() };

    const response = await server.post('/auth/changepassword').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.BAD_REQUEST);
  });

  it('should respond with status 200 and change password', async () => {
    const user = await createUser()
    const token = await generateValidToken(user);
    const newpassword = faker.internet.password(6)
    const body = {password: user.password, newpassword}


    const response = await server.post('/auth/changepassword').set('Authorization', `Bearer ${token}`).send(body);

    expect(response.status).toBe(httpStatus.OK);
    const changeduser = await prisma.user.findFirst({
      where:{
        id: user.id,
        password: newpassword
      }
    })
    expect(changeduser).toBeDefined();
  });
})