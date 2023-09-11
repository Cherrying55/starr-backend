import bcrypt from 'bcrypt';
import {faker} from '@faker-js/faker';
import { BillingAddress, User, UserSession } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { createUser } from './user.factory';
import { generateValidToken } from '../helpers';

const prisma = new PrismaClient();

export async function createWish(userId: number, productId: number){
    return await prisma.wishListItem.create({
        data:{
            userId,
            productId
        }
    })
}

