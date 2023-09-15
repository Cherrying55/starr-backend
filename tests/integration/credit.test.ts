import httpStatus from 'http-status';
import supertest from 'supertest';
import app, { init } from '@/app';
import { cleanDb, generateValidToken } from '../helpers';
import { faker } from '@faker-js/faker';
import { PrismaClient, User } from '@prisma/client';
import bcrypt from "bcrypt"
import { createBillingAddress, createUser, createUserandReturnUnhashed } from '../factories/user.factory';
import jwt from "jsonwebtoken"
import { createBillingAddressSchema } from '@/schemas/protocols';
import { createProduct, createProductCategory } from '../factories/product.factory';
import { createCart } from '../factories/cart.factory';
import { createCreditCard } from '../factories/credit.factory';
import { Credit } from '@/schemas/credit.schema';

const prisma = new PrismaClient()

beforeAll(async () => {
    await init();
    await cleanDb();
  });

const server = supertest(app);

describe("GET /credit", () => {
    it("should return status:unauthorized if no token is given", async () => {
        const response = await server.get('/credit');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      })
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/credit').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/credit').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 400 when body is not present', async () => {
        const token = await generateValidToken();
        const response = await server.get('/credit').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
    
      it('should respond with status 400 when body is not valid', async () => {
        const token = await generateValidToken();
        const body = { [faker.lorem.word()]: faker.lorem.word() };
    
        const response = await server.get('/credit').set('Authorization', `Bearer ${token}`).send(body);
    
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it('should return status forbbiden when password is wrong', async () => {
        const user = await createUserandReturnUnhashed()
        const token = await generateValidToken(user);
        const credit = await createCreditCard(user.id)
        const body = {password: user.password + "12"}
        const response = await server.get('/credit').set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.FORBIDDEN)

      })
      it('should return status 200', async () => {
        const user = await createUserandReturnUnhashed()
        const token = await generateValidToken(user);
        const credit = await createCreditCard(user.id)
        const body = {password: user.password}

        const response = await server.get('/credit').set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toBe(200)
        expect(response.body).toHaveLength(1)

      })
})

describe("POST /credit", () => {
    it("should return status:unauthorized if no token is given", async () => {
        const response = await server.post('/credit');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      })
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.post('/credit').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post('/credit').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 400 when body is not present', async () => {
        const token = await generateValidToken();
        const response = await server.post('/credit').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
    
      it('should respond with status 400 when body is not valid', async () => {
        const token = await generateValidToken();
        const body = { [faker.lorem.word()]: faker.lorem.word() };
    
        const response = await server.post('/credit').set('Authorization', `Bearer ${token}`).send(body);
    
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it('should return status 200', async () => {
        const user = await createUserandReturnUnhashed()
        const token = await generateValidToken(user);
        const body = {
            PAN: faker.finance.accountNumber(),
    cardholdername: faker.finance.accountName(),
    brand: faker.finance.creditCardIssuer()
        } 

        const response = await server.post('/credit').set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toBe(201)
        
        const hascredit = await prisma.creditCard.findFirst({
            where:{
                PAN: body.PAN,
                cardholdername: body.cardholdername,
                brand: body.brand,
                 userId: user.id
            }
        })
        expect(hascredit).toBeDefined()

      })
})

describe("PUT /credit/:creditId", () => {
    it("should return status:unauthorized if no token is given", async () => {
        const response = await server.put('/credit/1');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      })
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.put('/credit/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.put('/credit/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 400 when body is not present', async () => {
        const token = await generateValidToken();
        const response = await server.put('/credit/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
    
      it('should respond with status 400 when body is not valid', async () => {
        const token = await generateValidToken();
        const body = { [faker.lorem.word()]: faker.lorem.word() };
    
        const response = await server.put('/credit/1').set('Authorization', `Bearer ${token}`).send(body);
    
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it('should respond with status 404 when credit card is not found', async () => {
        const user = await createUserandReturnUnhashed()
        const token = await generateValidToken(user);
        const body = {
            PAN: faker.finance.accountNumber(),
    cardholdername: faker.finance.accountName(),
    brand: faker.finance.creditCardIssuer(),
        } 
        const response = await server.put('/credit/1').set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.NOT_FOUND)
      })

      it('should respond with status 200', async () => {
        const user = await createUserandReturnUnhashed()
        const token = await generateValidToken(user);
        const credit = await createCreditCard(user.id)
        const body = {
            PAN: faker.finance.accountNumber(),
    cardholdername: faker.finance.accountName(),
    brand: faker.finance.creditCardIssuer(),
        } 
        const response = await server.put(`/credit/${credit.id}`).set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.OK)
      })
      
})

describe("DELETE /credit", () => {
    it("should return status:unauthorized if no token is given", async () => {
        const response = await server.delete('/credit/1');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      })
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.delete('/credit/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.delete('/credit/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 400 when body is not present', async () => {
        const token = await generateValidToken();
        const response = await server.delete('/credit/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
    
      it('should respond with status 400 when body is not valid', async () => {
        const token = await generateValidToken();
        const body = { [faker.lorem.word()]: faker.lorem.word() };
    
        const response = await server.delete('/credit/1').set('Authorization', `Bearer ${token}`).send(body);
    
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it('should respond with status 404 when credit card is not found', async () => {
        const user = await createUserandReturnUnhashed()
        const token = await generateValidToken(user);
        const body = {
            password: user.password
        } 
        const response = await server.delete('/credit/1').set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.NOT_FOUND)
      })

      it('should return status forbbiden when password is wrong', async () => {
        const user = await createUserandReturnUnhashed()
        const token = await generateValidToken(user);
        const credit = await createCreditCard(user.id)
        const body = {password: user.password + "12"}
        const response = await server.delete(`/credit/${credit.id}`).set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.FORBIDDEN)

      })

      it('should return status 200', async () => {
        const user = await createUserandReturnUnhashed()
        const token = await generateValidToken(user);
        const credit = await createCreditCard(user.id)
        const body = {
            password: user.password
        } 
        const response = await server.put(`/credit/${credit.id}`).set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.OK)
      })

})