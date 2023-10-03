import { PrismaClient } from '@prisma/client';
import { Prisma } from '@prisma/client';

const prisma = new PrismaClient();

function createUser(userdata: Prisma.UserUncheckedCreateInput) {
  return prisma.user.create({
    data: userdata,
  });
}

function getUserByEmail(email: string) {
  return prisma.user.findFirst({
    where: {
      email,
    },
  });
}

function getUserById(id: number) {
  return prisma.user.findUnique({
    where: {
      id,
    },
  });
}

async function createSession(data: Prisma.UserSessionUncheckedCreateInput) {
  const upsertSession = prisma.userSession.upsert({
    create: {
      userId: data.userId,
      token: data.token,
    },
    update: {
      token: data.token,
    },
    where: {
      userId: data.userId,
    },
  });

  return await upsertSession;
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

function updateBillingAddress(userId: number, id: number, data: any) {
  const updateBillingAddress = prisma.billingAddress.update({
    where: {
      id: userId,
    },
    data,
  });
  return updateBillingAddress;
}

function getBillingAdressbyId(userId: number, id: number) {
  const billingaddress = prisma.billingAddress.findFirst({
    where: {
      userId,
      id,
    },
  });
  return billingaddress;
}

function getBillingAddresses(userId: number){
  const billingaddresses = prisma.billingAddress.findMany({
    where:{
      userId
    }
  })
  return billingaddresses
}

function deleteBillingAddress(userId: number, id: number) {
  const deleted = prisma.billingAddress.deleteMany({
    where: {
      userId,
      id,
    },
  });
}

function getUserSessionByUserId(userId: number) {
  const token = prisma.userSession.findUnique({
    where: {
      userId,
    },
  });
  return token;
}

export const userrepository = {
  createUser,
  createSession,
  createRetiredPassword,
  createLoginAttempt,
  updateBillingAddress,
  updatePassword,
  createBillingAddress,
  deleteBillingAddress,
  getUserByEmail,
  getUserById,
  getBillingAdressbyId,
  getUserSessionByUserId,
  getBillingAddresses
};
