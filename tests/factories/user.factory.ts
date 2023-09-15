import bcrypt from 'bcrypt';
import {faker} from '@faker-js/faker';
import { BillingAddress, User, UserSession } from '@prisma/client';
import { PrismaClient } from '@prisma/client';
import { createBillingAddressSchema } from '@/schemas/protocols';

const prisma = new PrismaClient()


export async function createUser(): Promise<User> {
  const incomingPassword = faker.internet.password(6);
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  return prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: hashedPassword,
      name: faker.person.fullName()
    },
  });
}

export async function createUserandReturnUnhashed(){
  const incomingPassword = faker.internet.password(6);
  const hashedPassword = await bcrypt.hash(incomingPassword, 10);

  const user = await prisma.user.create({
    data: {
      email: faker.internet.email(),
      password: hashedPassword,
      name: faker.person.fullName()
    },
  });

  return({
    email: user.email,
    password: incomingPassword.toString(),
    id: user.id,
    name: user.name,

  } as User)
}

export async function createUserSession(token: string, user: User): Promise<UserSession>{
  return prisma.userSession.create({
    data: {
      token: token,
      userId: user.id,
    },
  });
}

export async function createBillingAddress(userId: number): Promise<BillingAddress>{
  const data:createBillingAddressSchema = {
    addresstype: "xx",
    country: faker.location.country(),
    state: faker.location.state(),
    city: faker.location.city(),
    zipcode: faker.number.bigInt().toString(),
    street: "Test Street",
    number: faker.number.int().toString(),
    complemento: "Apt 44",
    userId

  }
  return prisma.billingAddress.create({
    data
  })
}