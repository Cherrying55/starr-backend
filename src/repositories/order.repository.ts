import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getOrdersbyUserId(userId: number) {
  return prisma.order.findMany({
    where: {
      userId,
    },
  });
}

function getOrderItemsbyOrderId(orderId: number) {
  return prisma.orderItem.findMany({
    where: {
      orderId,
    },
  });
}

  function createOrder(userId: number) {
  const created = prisma.order.create({
    data: {
      userId,
    },
  });
  return created;
}

  function createOrderItem(orderId: number, quantity: number, productId: number) {
  const created = prisma.orderItem.create({
    data: {
      orderId,
      quantity,
      productId,
    },
  });
  return created;
}

  function createOrderStatus(orderId: number, status: string) {
  const created = prisma.orderStatus.create({
    data: {
      orderId,
      status,
    },
  });
  return created;
}

  function updateOrderStatus(orderId: number, status: string) {
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

export const orderRepository = {
  getOrdersbyUserId,
  getOrderItemsbyOrderId,
  createOrder,
  createOrderItem,
  createOrderStatus,
  updateOrderStatus
}