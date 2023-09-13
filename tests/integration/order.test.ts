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
import { createOrder } from '../factories/order.factory';

const prisma = new PrismaClient()

beforeAll(async () => {
    await init();
    await cleanDb();
  });

const server = supertest(app);

describe("GET /orders", () => {
    it("should return status:unauthorized if no token is given", async () => {
        const response = await server.get('/orders');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      })
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/orders').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/orders').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it("should return an empty array if there are no orders for given user", async () => {
        const user = await createUser()
        const token = await generateValidToken(user);

        const response = await server.get('/orders').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(0)
      })

      it("should return status 200", async () => {
        const user = await createUser()
        const token = await generateValidToken(user);
        const productcategory = await createProductCategory()
        const product = await createProduct(productcategory.id)
        const order = await createOrder(user.id, product.id, 1)
        const response = await server.get('/orders').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1)

      })
})

describe("GET /orders/:orderId", () => {
    it("should return status:unauthorized if no token is given", async () => {
        const response = await server.get('/orders/1');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      })
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.get('/orders/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.get('/orders/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should return 404 if the order is not found', async () => {
        const user = await createUser()
        const token = await generateValidToken(user);
        const response = await server.get('/orders/1').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.NOT_FOUND);
      })

      it('should return status 200', async () => {
        const user = await createUser()
        const token = await generateValidToken(user);
        const productcategory = await createProductCategory()
        const product = await createProduct(productcategory.id)
        const order = await createOrder(user.id, product.id, 1)
        const response = await server.get('/orders/1').set('Authorization', `Bearer ${token}`);

        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1)
      })
})

describe("POST /orders", () => {
    it("should return status:unauthorized if no token is given", async () => {
        const response = await server.post('/orders');
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      })
    
      it('should respond with status 401 if given token is not valid', async () => {
        const token = faker.lorem.word();
    
        const response = await server.post('/orders').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });
    
      it('should respond with status 401 if there is no session for given token', async () => {
        const userWithoutSession = await createUser();
        const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);
    
        const response = await server.post('/orders').set('Authorization', `Bearer ${token}`);
    
        expect(response.status).toBe(httpStatus.UNAUTHORIZED);
      });

      it('should respond with status 400 when body is not present', async () => {
        const token = await generateValidToken();
        const response = await server.post('/orders').set('Authorization', `Bearer ${token}`);
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });
    
      it('should respond with status 400 when body is not valid', async () => {
        const token = await generateValidToken();
        const body = { [faker.lorem.word()]: faker.lorem.word() };
    
        const response = await server.post('/orders').set('Authorization', `Bearer ${token}`).send(body);
    
        expect(response.status).toBe(httpStatus.BAD_REQUEST);
      });

      it("should respond with status 200", async () => {
        const user = await createUser()
        const token = await generateValidToken(user);
        const productcategory = await createProductCategory()
        const product = await createProduct(productcategory.id)
        const body = {productId: product.id, quantity: 1}
        const response = await server.post('/orders').set('Authorization', `Bearer ${token}`).send(body);

        const hasorder = await prisma.order.findFirst({
            where:{
                userId: user.id
            }
        })
        const orderitem = await prisma.orderItem.findFirst({
            where:{
                orderId: hasorder.id,
                quantity: 1,
                productId: product.id
            }
        })
        const orderstatus = await prisma.orderStatus.findFirst({
            where:{
                orderId: hasorder.id
            }
        })

        expect(hasorder).toBeDefined()
        expect(orderitem).toBeDefined()
        expect(orderstatus).toBeDefined()

      })
    
})