import { PrismaClient, User } from "@prisma/client";
import { createUser, createUserSession } from "./factories/user.factory";
import jwt from "jsonwebtoken"
const prisma = new PrismaClient()

const table = ['User', 'RetiredPassword', 'BillingAddress', 'UserSession', 'LoginAttempt', 'CreditCard', 'TokenCredit', 
'TokenCreditUses', 'Product', 'ProductCategory', 'PricingHistory', 'Cartitem', 'WishListItem', 'Order', 
'OrderItem', 'OrderStatus']

export async function cleanDb(){
    try {
        for(const name of table){
            await prisma.$queryRaw`DELETE FROM "${name}";`;
        }
        
    } catch (error) {
        console.log(error)
    }
 finally {
    await prisma.$disconnect();
  }
}

export async function generateValidToken(user?: User) {
  const incomingUser = user || (await createUser());
  const token = jwt.sign({ userId: incomingUser.id }, process.env.JWT_SECRET);

  await createUserSession(token, incomingUser);

  return token;
}


/*

  await prisma.user.deleteMany();
    await prisma.retiredPassword.deleteMany();
    await prisma.billingAddress.deleteMany();
    await prisma.userSession.deleteMany();
    await prisma.loginAttempt.deleteMany();
    await prisma.creditCard.deleteMany();
    await prisma.tokenCredit.deleteMany();
    await prisma.tokenCreditUses.deleteMany();
    await prisma.product.deleteMany();
    await prisma.productCategory.deleteMany();
    await prisma.pricingHistory.deleteMany();
    await prisma.cartItem.deleteMany();
    await prisma.wishListItem.deleteMany();
    await prisma.order.deleteMany()
*/