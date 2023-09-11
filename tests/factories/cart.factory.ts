import bcrypt from 'bcrypt';
import {faker} from '@faker-js/faker';
import { BillingAddress, User, UserSession } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { createUser } from './user.factory';
import { generateValidToken } from '../helpers';

const prisma = new PrismaClient();

export async function createCart(userId: number, productId: number){
    return await prisma.cartItem.create({
        data:{
            userId,
            quantity: 1,
            productId,
        }
    })
}

