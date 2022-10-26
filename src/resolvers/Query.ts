import { Product, User as  UserType } from "@prisma/client";
import { Context } from "../index";
import { productLoader } from "../loaders/userLoader";
import { userQueryResolvers } from "./user";

export const Query = {
  ...userQueryResolvers,
};

export const User = {
  products: async (
    parent: UserType,
    __: any,
    { prisma }: Context
  ): Promise<Product[]> => {
    const { id: parentId } = parent;
    // const product = await prisma.product.findMany({
    //   where: {
    //     ownerId: parentId,
    //   },
    // });

    return productLoader.load(parentId);
    // return product;
  },
};
