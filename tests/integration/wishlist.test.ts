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
import { createWish } from '../factories/wishlist.factory';

const prisma = new PrismaClient()

beforeAll(async () => {
    await init();
    await cleanDb();
  });

const server = supertest(app);

describe("POST /wishlist/:productId", () => {
  it("should return status:unauthorized if no token is given", async () => {
    const response = await server.post('/wishlist/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  })

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.post('/wishlist/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.post('/wishlist/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });


  it('should respond with status 404 if there is no wishlist item for given productId', async () => {
    const user = await createUser()
    const token = await generateValidToken(user);
    const productcategory = await createProductCategory()
    const product = await createProduct(productcategory.id);
    const response = await server.post(`/wishlist/${product.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND)
  })

  it('should respond with status 201', async () => {
    const user = await createUser()
    const token = await generateValidToken(user);
    const productcategory = await createProductCategory()
    const product = await createProduct(productcategory.id);
    const wishitem = await createWish(user.id, product.id)


    const response = await server.post(`/wishlist/${product.id}`).set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(201)

    const wish = await prisma.cartItem.findFirst({
        where:{
            productId: product.id,
            userId: user.id,
        }
    })
    expect(wish).toBeUndefined()
  })
}) 

describe("GET /wishlist", () => {
  it("should return status:unauthorized if no token is given", async () => {
    const response = await server.get('/wishlist');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  })

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.get('/wishlist').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.get('/wishlist').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with an empty array if there is no items in the wishlist', async () => {
    const user = await createUser()
    const token = await generateValidToken(user);
    const productcategory = await createProductCategory()
    const product = await createProduct(productcategory.id);
    const response = await server.get(`/wishlist`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND)
  })

  it('should respond with status 200', async () => {
    const user = await createUser()
    const token = await generateValidToken(user);
    const productcategory = await createProductCategory()
    const product = await createProduct(productcategory.id);
    const wishitem = await createWish(user.id, product.id)

    const response = await server.get('/wishlist').set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.OK);
    expect(response.body).toEqual(wishitem)
  })


})

describe("DELETE /wishlist/:productId", () => {
  it("should return status:unauthorized if no token is given", async () => {
    const response = await server.delete('/wishlist/1');

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  })

  it('should respond with status 401 if given token is not valid', async () => {
    const token = faker.lorem.word();

    const response = await server.delete('/wishlist/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 401 if there is no session for given token', async () => {
    const userWithoutSession = await createUser();
    const token = jwt.sign({ userId: userWithoutSession.id }, process.env.JWT_SECRET);

    const response = await server.delete('/wishlist/1').set('Authorization', `Bearer ${token}`);

    expect(response.status).toBe(httpStatus.UNAUTHORIZED);
  });

  it('should respond with status 404 if there is no wishlist item for given productId', async () => {
    const user = await createUser()
    const token = await generateValidToken(user);
    const productcategory = await createProductCategory()
    const product = await createProduct(productcategory.id);
    const response = await server.delete(`/wishlist/${product.id}`).set('Authorization', `Bearer ${token}`);
    expect(response.status).toBe(httpStatus.NOT_FOUND)
  })

  it('should respond with status 200', async () => {
    const user = await createUser()
    const token = await generateValidToken(user);
    const productcategory = await createProductCategory()
    const product = await createProduct(productcategory.id);
    const wishitem = await createWish(user.id, product.id)


    const response = await server.delete(`/wishlist/${product.id}`).set('Authorization', `Bearer ${token}`)
    expect(response.status).toBe(200)

    const deleted = await prisma.cartItem.findFirst({
        where:{
            productId: product.id,
            userId: user.id,
        }
    })
    expect(deleted).toBeUndefined()
  })


})