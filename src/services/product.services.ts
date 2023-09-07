import { productrepository } from '../repositories/product.repository';

async function getAllProducts() {
  return await productrepository.getAllProducts();
}

async function getProductByCategoryId(categoryId: number) {
  return await productrepository.getProductByCategoryId(categoryId);
}

async function updateProductStock(productId: number, stock: number) {
  const updated = await productrepository.updateProductStock(productId, stock);
  return updated;
}

export const productservices = {
  getAllProducts,
  getProductByCategoryId,
  updateProductStock,
};
