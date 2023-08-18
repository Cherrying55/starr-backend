import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function getOrdersbyUserId(userId: number) {
  return prisma.order.findMany({
    where: {
      userId,
    },
  });
}

export function getOrderItemsbyOrderId(orderId: number) {
  return prisma.orderItem.findMany({
    where: {
      orderId,
    },
  });
}

export function createOrder(userId: number) {
  const created = prisma.order.create({
    data: {
      userId,
    },
  });
  return created;
}

export function createOrderItem(orderId: number, quantity: number, productId: number) {
  const created = prisma.orderItem.create({
    data: {
      orderId,
      quantity,
      productId,
    },
  });
  return created;
}

export function createOrderStatus(orderId: number, status: string) {
  const created = prisma.orderStatus.create({
    data: {
      orderId,
      status,
    },
  });
  return created;
}

export function updateOrderStatus(orderId: number, status: string) {
  const updated = prisma.orderStatus.update({
    where: {
      orderId,
    },
    data: {
      status,
    },
  });
  return updated;
}

export function deleteOrder(orderId: number) {
  const deleted = prisma.order.delete({
    where: {
      id: orderId,
    },
  });
  return deleted;
}

export function deleteAllOrderItems(orderId: number) {
  const deleted = prisma.orderItem.deleteMany({
    where: {
      orderId,
    },
  });
  return deleted;
}

export function deleteOrderStatus(orderId: number) {
  const deleted = prisma.orderStatus.delete({
    where: {
      orderId,
    },
  });
}
