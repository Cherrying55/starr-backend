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
import { createProduct, createProductCategory } from '../factories/product.factory';
import { createCart } from '../factories/cart.factory';

const prisma = new PrismaClient()

beforeAll(async () => {
    await init();
    await cleanDb();
  });

const server = supertest(app);

describe("POST /cart", () => {
    it("should return status:unauthorized if no token is given", async () => {
        const response = await server.post('/cart');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      })
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.post('/cart').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post('/cart').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 400 when body is not present', async () => {
        const token = await generateValidToken();
        const response = await server.post('/cart').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
    
      it('should respond with status 400 when body is not valid', async () => {
        const token = await generateValidToken();
        const body = { [faker.lorem.word()]: faker.lorem.word() };
    
        const response = await server.post('/cart').set('Authorization', `Bearer ${token}`).send(body);
    
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

     it('should respond with status 200 when body is valid', async () => {
        const user = await createUser()
        const token = await generateValidToken(user);
        const productcategory = await createProductCategory();
        const product = await createProduct(productcategory.id)

        const body = {
            quantity: 1,
            productId: product.id
        }

        const response = await server.post('/cart').set('Authorization', `Bearer ${token}`).send(body);

        expect(response.status).toBe(httpStatus.OK);

        const posted = await prisma.cartItem.findFirst({
            where:{
                userId: user.id,
                productId: product.id
            }
        })
        expect(posted).toBeDefined()
     })
})

describe("GET /cart", () => {

    it("should return status:unauthorized if no token is given", async () => {
        const response = await server.post('/cart');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      })
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.post('/cart').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post('/cart').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it('should return an empty array if user has nothing in the cart', async () => {
        const user = await createUser()
        const token = await generateValidToken(user);

        const response = await server.get('/cart').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toHaveLength(0)
      })

      it('should return status 200', async () => {
        const user = await createUser()
        const token = await generateValidToken(user);
        const productcategory = await createProductCategory()
        const product = await createProduct(productcategory.id);
        const cartitem = await createCart(user.id, product.id)

        const response = await server.get('/cart').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toHaveLength(1)
      })
})

describe("GET /cart/:id", () => {

    it("should return status:unauthorized if no token is given", async () => {
        const response = await server.get('/cart/1');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      })
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/cart/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/cart/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it('should return nothing if there is no cartitem for given productId', async() => {
        const user = await createUser()
        const token = await generateValidToken(user);
        const productcategory = await createProductCategory()
        const product = await createProduct(productcategory.id);

        const response = await server.get(`/cart/${product.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toHaveLength(0)

      })

      it('should return the product and status 200', async () => {
        const user = await createUser()
        const token = await generateValidToken(user);
        const productcategory = await createProductCategory()
        const product = await createProduct(productcategory.id);
        const cartitem = await createCart(user.id, product.id)

        const response = await server.get(`/cart/${product.id}`).set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(httpStatus.OK);
        expect(response.body).toEqual(product)
      })
})

describe("PUT /cart/:id", () => {
    it("should return status:unauthorized if no token is given", async () => {
        const response = await server.put('/cart/1');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      })
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.put('/cart/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.put('/cart/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it('should respond with status 400 when body is not present', async () => {
        const token = await generateValidToken();
        const response = await server.put('/cart/1').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
    
      it('should respond with status 400 when body is not valid', async () => {
        const token = await generateValidToken();
        const body = { [faker.lorem.word()]: faker.lorem.word() };
    
        const response = await server.put('/cart/1').set('Authorization', `Bearer ${token}`).send(body);
    
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it('should respond with status 404 if there is no cartitem for given productId', async () => {
        const user = await createUser()
        const token = await generateValidToken(user);
        const productcategory = await createProductCategory()
        const product = await createProduct(productcategory.id);
        const body = {quantity: 1}
        const response = await server.put(`/cart/${product.id}`).set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(httpStatus.NOT_FOUND)
      })

      it('should respond with status 200', async () => {
        const user = await createUser()
        const token = await generateValidToken(user);
        const productcategory = await createProductCategory()
        const product = await createProduct(productcategory.id);
        const cartitem = await createCart(user.id, product.id)

        const body = {quantity: cartitem.quantity + 1}
        const response = await server.put(`/cart/${product.id}`).set('Authorization', `Bearer ${token}`).send(body);
        expect(response.status).toBe(200)

        const updated = await prisma.cartItem.findFirst({
            where:{
                productId: product.id,
                userId: user.id,
                quantity: cartitem.quantity + 1
            }
        })
        expect(updated).toBeDefined()
      })

})

describe("DELETE /cart/:id", () => {
    it("should return status:unauthorized if no token is given", async () => {
        const response = await server.delete('/cart/1');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      })
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.delete('/cart/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.delete('/cart/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
  

      it('should respond with status 404 if there is no cartitem for given productId', async () => {
        const user = await createUser()
        const token = await generateValidToken(user);
        const productcategory = await createProductCategory()
        const product = await createProduct(productcategory.id);
        const response = await server.delete(`/cart/${product.id}`).set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.NOT_FOUND)
      })

      it('should respond with status 200', async () => {
        const user = await createUser()
        const token = await generateValidToken(user);
        const productcategory = await createProductCategory()
        const product = await createProduct(productcategory.id);
        const cartitem = await createCart(user.id, product.id)


        const response = await server.delete(`/cart/${product.id}`).set('Authorization', `Bearer ${token}`)
        expect(response.status).toBe(200)

        const deleted = await prisma.cartItem.findFirst({
            where:{
                productId: product.id,
                userId: user.id,
                quantity: cartitem.quantity
            }
        })
        expect(deleted).toBeUndefined()
      })

})