import bcrypt from 'bcrypt';
import {faker} from '@faker-js/faker';
import { BillingAddress, User, UserSession } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { createUser } from './user.factory';
import { generateValidToken } from '../helpers';

const prisma = new PrismaClient();

export async function createOrder(userId: number, productId: number, quantity: number){
    const order = await prisma.order.create({
        data:{
            userId
        }
    })
    const status = await prisma.orderStatus.create({
        data:{
            orderId: order.id,
            status: "open"
        }
    })
    return await prisma.orderItem.create({
        data:{
            productId,
            quantity,
            orderId: order.id
        }
    })
    
}
