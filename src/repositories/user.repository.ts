import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function createUser(userdata: any) {
  return prisma.user.create({
    data: userdata,
  });
}

export function createSession(userId: number, token: string) {
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

export function createLoginAttempt(data: any) {
  return prisma.loginAttempt.create({
    data,
  });
}

export function createRetiredPassword(data: any) {
  return prisma.retiredPassword.create({
    data,
  });
}

export function createBillingAddress(data: any) {
  return prisma.billingAddress.create({
    data,
  });
}

export function updatePassword(userId: number, password: string) {
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

export function updateBillingAddress(userId: number, data: any) {
  const updateBillingAddress = prisma.billingAddress.update({
    where: {
      id: userId,
    },
    data,
  });
  return updateBillingAddress;
}
