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

export const userMutationResolvers = {
  createShop: async (
    _: any,
    { name }: createShopArgs,
    { prisma, user }: Context
  ): Promise<ShopPayload> => {
    if (!user) {
      throw new GraphQLError("you must log in", {
        extensions: { code: "UNAUTHENTICATED" },
      });
    }

    const { email, phoneNumber, userId } = user;

    const isShopNameValid = validator.isLength(name, {
      min: 3,
    });
    if (!isShopNameValid)
      return {
        userErrors: [{ message: "shop name is not valid" }],
        shop: [],
      };

    const shop = await prisma.shop.create({
      data: {
        name,
        ownerId: userId,
      },
    });

    return { userErrors: [], shop: [shop] };
  },
  selectShop: (_: any, __: any, { prisma, user }: Context) => {},
};

export const userQueryResolvers = {
  userShops: async (
    _: any,
    __: any,
    { prisma, user }: Context
  ): Promise<ShopPayload> => {
    if (!user) {
      throw new GraphQLError("user is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      });
    }

    const { userId, email, phoneNumber } = user;

    const shop = await prisma.shop.findMany({
      where: {
        ownerId: userId,
      },
    });

    return { userErrors: [], shop };
  },
  users: async (_: any, __: any, { prisma }: Context) => {
    const users = await prisma.user.findMany()
    
    return users
  },
};
