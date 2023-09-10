import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getCreditCardbyId(userId: number, id: number) {
  return prisma.creditCard.findFirst({
    where: {
      userId,
      id
    },
  });
}

function getCreditCards(userId: number){
  return prisma.creditCard.findMany({
    where:{
      userId
    }
  })
}

function createCreditCard(data: any) {
  return prisma.creditCard.create({
    data,
  });
}

function createCreditToken(creditId: number, token: string) {
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
  return upsertSession;
}

function createTokenCreditUse(data: any) {
  const created = prisma.tokenCreditUses.create({
    data,
  });
  return created;
}

function updateCreditCard(creditId: number, data: any) {
  const updated = prisma.creditCard.update({
    where: {
      id: creditId,
    },
    data,
  });
  return updated;
}

function deleteCreditCard(creditId: number) {
  const deleted = prisma.creditCard.delete({
    where: {
      id: creditId,
    },
  });
  return deleted;
}

function deleteTokenCredit(creditId: number) {
  const deleted = prisma.tokenCredit.delete({
    where: {
      creditId,
    },
  });
  return deleted;
}

function getTokenCreditByCreditId(creditId: number) {
  return prisma.tokenCredit.findUnique({
    where: {
      creditId,
    },
  });
}

export const creditRepository = {
  getCreditCardbyId,
  getCreditCards,
  createCreditCard,
  createCreditToken,
  createTokenCreditUse,
  deleteCreditCard,
  deleteTokenCredit,
  updateCreditCard,
  getTokenCreditByCreditId,
};
