import { Shop } from "@prisma/client";
import { GraphQLError } from "graphql";
import validator from "validator";
import { Context } from "../index";
interface createShopArgs {
  name: string;
}

interface ShopPayload {
  userErrors: {
    message: string;
  }[];
  shop: Shop | Shop[];
}


export const userQueryResolvers = {
  users: async (_: any, __: any, { prisma }: Context) => {
    const users = await prisma.user.findMany()
    
    return users
  },
};
