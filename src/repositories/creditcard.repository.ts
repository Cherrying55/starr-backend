import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

  function getCreditCardbyUserId(userId: number) {
  return prisma.creditCard.findFirst({
    where: {
      userId,
    },
  });
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

  function createTokenCreditUse(tokenId: number, operationtype: string, executedAt: string, status: string) {
  const created = prisma.tokenCreditUses.create({
    data: {
      tokenId,
      operationtype,
      executedAt,
      status,
    },
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

export const creditRepository = {
  getCreditCardbyUserId,
  createCreditCard,
  createCreditToken,
  createTokenCreditUse,
  deleteCreditCard,
  deleteTokenCredit,
  updateCreditCard
}