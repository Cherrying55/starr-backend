import bcrypt from 'bcrypt';
import {faker} from '@faker-js/faker';
import { BillingAddress, User, UserSession, ProductCategory } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { createUser } from './user.factory';
import { generateValidToken } from '../helpers';

const prisma = new PrismaClient();

export async function createProductCategory(){
    return await prisma.productCategory.create({
        data:{
            name: faker.commerce.productAdjective(),
            description: faker.lorem.sentence(),
            createdAt: faker.date.recent()
        }
    })
}

export async function createProduct(categoryId: number){
    return await prisma.product.create({
        data:{
    name: faker.commerce.product(),
    sku: faker.string.nanoid(),
    description: faker.commerce.productDescription(),
    price: faker.number.int(),
    previewimage: faker.image.url(),
    image1: faker.image.url(),
    image2: faker.image.url(),
    image3:faker.image.url(),
    image4: faker.image.url(),
    categoryId: categoryId,
    stock: faker.number.int(),
    createdAt: faker.date.recent()
    }
    })
}

