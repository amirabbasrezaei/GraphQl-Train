import { prisma } from "..";
import type { Context } from "..";
import { Product } from "@prisma/client";

import DataLoader from "dataloader";

type productBatchFnType = (ownerIds: string[]) => Promise<Product[][]>;

const productBatchFn: productBatchFnType = async (ownerIds) => {
  const products = await prisma.product.findMany({
    where: {
      ownerId: {
        in: ownerIds,
      },
    },
  });

  const productMap: { [key: string]: Product[] } = {};

  ownerIds.forEach((ownerId) => {
    productMap[ownerId] = products;
  });
  console.log(ownerIds.map((ownerId) => productMap[ownerId]))
  return ownerIds.map((ownerId) => productMap[ownerId]);
};

// @ts-ignore
export const productLoader = new DataLoader<string, Product[]>(productBatchFn);
