import { orderRepository } from '../repositories/order.repository';

async function getOrdersByUserId(id: number) {
  return await orderRepository.getOrdersbyUserId(id);
}

async function getOrderItemsByOrderId(orderId: number, userId: number) {
  const order = await orderRepository.getOrderById(orderId);
  if(!order){
    return "no order found"
  }
  if (order?.userId !== userId) {
    let err = new Error();
    err.name = '403';
    err.message = '403';
    return "unauthorized"
    throw err;
  }
  return await orderRepository.getOrderItemsbyOrderId(orderId);
}

async function createOrder(userId: number) {
  return await orderRepository.createOrder(userId);
}

async function createOrderItem(userId: number, quantity: number, productId: number) {
  //createorder, check for userId before
  const createorder =  await orderRepository.createOrder(userId);
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
