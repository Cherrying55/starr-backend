import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function createUser(userdata: any) {
  return prisma.user.create({
    data: userdata,
  });
}

function createSession(userId: number, token: string) {
  const upsertSession = prisma.userSession.upsert({
    where: {
      userId,
    },
    update: {
      token,
    },
    create: {
      userId,
      token,
    },
  });

  return upsertSession;
}

function createLoginAttempt(data: any) {
  return prisma.loginAttempt.create({
    data,
  });
}

function createRetiredPassword(data: any) {
  return prisma.retiredPassword.create({
    data,
  });
}

function createBillingAddress(data: any) {
  return prisma.billingAddress.create({
    data,
  });
}

function updatePassword(userId: number, password: string) {
  const updatePassword = prisma.user.update({
    where: {
      id: userId,
    },
    data: {
      password,
    },
  });
  return updatePassword;
}

function updateBillingAddress(userId: number, data: any) {
  const updateBillingAddress = prisma.billingAddress.update({
    where: {
      id: userId,
    },
    data,
  });
  return updateBillingAddress;
}

export const userrepository = {
  createUser,
  createSession,
  createRetiredPassword,
  createLoginAttempt,
  updateBillingAddress,
  updatePassword,
  createBillingAddress
}