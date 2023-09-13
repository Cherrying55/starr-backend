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

describe("GET /products", () => {
    it("should return an empty array if there are no products", async () => {
        const response = await server.get("/products");
        expect(response.body).toHaveLength(0)
    })
    it("should return status 200", async () => {
        const category = await createProductCategory();
        const product1 = await createProduct(category.id)
        const product2 = await createProduct(category.id)
        const response = await server.get("/products")
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(2)
    })
}) 

describe("GET /products/:categoryId", () => {
    it("should return an empty array if there are no products for given category", async () => {
        const response = await server.get("/products/1");
        expect(response.body).toHaveLength(0)
    })
    it("should return status 200", async () => {
        const category = await createProductCategory();
        const category2 = await createProductCategory()
        const product1 = await createProduct(category.id)
        const product2 = await createProduct(category2.id)
        const response = await server.get("/products/1")
        expect(response.status).toBe(200);
        expect(response.body).toHaveLength(1)
    })
})