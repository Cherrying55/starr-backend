import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function getCreditCardbyUserId(userId: number){
    return prisma.creditCard.findFirst({
        where:{
            userId
        }
    })
}

export function createCreditCard(data: any){
    return prisma.creditCard.create({
        data
    })
}

export function createCreditToken(creditId: number, token: string){
    const upsertSession = prisma.tokenCredit.upsert({
        where: {
          creditId,
        },
        update: {
          token,
        },
        create: {
          creditId,
          token,
        },
      });
      return upsertSession
}

export function createTokenCreditUse(tokenId: number, operationtype: string, executedAt: string, status: string){
    const created = prisma.tokenCreditUses.create({
        data:{
            tokenId,
            operationtype,
            executedAt,
            status
        }
    })
    return created;
}

export function updateCreditCard(creditId: number, data: any){
    const updated = prisma.creditCard.update({
        where:{
            id: creditId
        },
        data
    })
    return updated;
}

export function deleteCreditCard(creditId: number){
    const deleted = prisma.creditCard.delete({
        where:{
            id: creditId
        }
    })
    return deleted;
}

export function deleteTokenCredit(creditId: number){
    const deleted = prisma.tokenCredit.delete({
        where:{
            creditId
        }
    })
    return deleted;
}