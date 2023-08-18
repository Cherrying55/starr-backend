import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export function getAllProducts(){
    return prisma.product.findMany();
}

export function getProductByCategoryId(categoryId: number){
    return prisma.product.findMany(
        {
            where:{
                categories:{
                    some:{
                        id: categoryId
                    }
                }
            }
        }
    )
}

export function updateProductStock(productId: number, stock: number) {
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