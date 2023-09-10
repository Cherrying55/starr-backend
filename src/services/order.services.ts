import { notfoundError } from '@/errors/notfound.error';
import { unauthorizedError } from '@/errors/unauthorized.error';
import { userrepository } from '@/repositories/user.repository';
import { orderRepository } from '../repositories/order.repository';

async function getOrdersByUserId(id: number) {
  const hasuser = await userrepository.getUserById(id);
  if (!hasuser) {
    throw notfoundError('User');
  }
  return await orderRepository.getOrdersbyUserId(id);
}

async function getOrderItemsByOrderId(orderId: number, userId: number) {
  const order = await orderRepository.getOrderById(orderId);
  const user = await userrepository.getUserById(userId);
  if (!user) {
    throw notfoundError('User');
  }
  if (!order) {
    throw notfoundError('Order');
  }
  if (order?.userId !== userId) {
    throw unauthorizedError();
  }
  return await orderRepository.getOrderItemsbyOrderId(orderId);
}

async function createOrderItem(userId: number, quantity: number, productId: number) {
  const user = await userrepository.getUserById(userId);
  if (!user) {
    throw notfoundError('User');
  }
  const createorder = await orderRepository.createOrder(userId);
  const status = createOrderStatus(createorder.id, 'open');
  return await orderRepository.createOrderItem(createorder.id, quantity, productId);
}

async function createOrderStatus(orderId: number, status: string) {
  return await orderRepository.createOrderStatus(orderId, status);
}

async function updateOrderStatus(orderId: number, status: string) {
  return await orderRepository.updateOrderStatus(orderId, status);
}

export const orderservices = {
  getOrderItemsByOrderId,
  getOrdersByUserId,
  createOrderItem,
  createOrderStatus,
  updateOrderStatus,
};
