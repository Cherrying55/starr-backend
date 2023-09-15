import bcrypt from 'bcrypt';
import {faker} from '@faker-js/faker';
import { BillingAddress, User, UserSession } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { createUser } from './user.factory';
import { generateValidToken } from '../helpers';

const prisma = new PrismaClient();

export async function createCreditCard(userId: number){

   
    const creditcard = await prisma.creditCard.create({
        data:{
            userId,
            PAN: faker.finance.accountNumber(),
            cardholdername: faker.finance.accountName(),
            brand: faker.finance.creditCardIssuer(),
        }
    })
    prisma.tokenCredit.create({
        data:{
            creditId: creditcard.id,
            token: faker.lorem.word()
        }
    })
    return creditcard
}

