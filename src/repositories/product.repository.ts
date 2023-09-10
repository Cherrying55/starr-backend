import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

function getAllProducts() {
  return prisma.product.findMany();
}

function getProductByCategoryId(categoryId: number) {
  return prisma.product.findMany({
    where: {
      categories: {
        some: {
          id: categoryId,
        },
      },
    },
  });
}

function getProductById(id: number){
  return prisma.product.findUnique({
    where:{
      id
    }
  })
}
function updateProductStock(productId: number, stock: number) {
  const updated = prisma.product.update({
    where: {
      id: productId,
    },
    data: {
      stock,
    },
  });
  return updated;
}

export const productrepository = {
  getAllProducts,
  getProductByCategoryId,
  updateProductStock,
  getProductById
};
