import { Product, Shop, User } from "@prisma/client";
import { UserInputError } from "apollo-server";
import { GraphQLError } from "graphql";
import { Context } from "../index";

type ProductCreateArgs = {
  title: string;
  content: string;
  shopId: string;
};

interface ProductPayload {
  userErrors: {
    message: string;
  }[];
  product?: Product | null;
}

interface ProductUpdateArgs {
  productId: string;
  product: {
    title?: string;
    content?: string;
  };
}

interface productSetPublishStatusArgs {
  id: string;
  status: boolean;
}

export const productMutationResolvers = {
  productCreate: async (
    parent: any,
    { title, content, shopId }: ProductCreateArgs,
    { prisma, user }: Context
  ): Promise<ProductPayload> => {
    if (!user)
      throw new GraphQLError("you must log in", {
        extensions: { code: "UNAUTHENTICATED" },
      });

    const { userId } = user;

    const checkTitle = await prisma.product.findFirst({
      where: { title, shopId },
    });

    if (checkTitle) {
      return {
        userErrors: [{ message: "this product already exits" }],
        product: null,
      };
    }

    const createProduct = await prisma.product.create({
      data: { title, content, shopId, ownerId: userId },
    });
    return { userErrors: [], product: createProduct };
  },

  productUpdate: async (
    _: any,
    { productId, product }: ProductUpdateArgs,
    { prisma }: Context
  ): Promise<ProductPayload> => {
    const { title, content } = product;

    const checkProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!checkProduct) {
      throw new UserInputError("Product does not exist");
    }

    if (!content && !title) {
      throw new UserInputError("provided arguments is not correct");
    }

    // if (!post.content) delete post.content;
    // if (!post.title) delete post.title;

    Object.keys(product).forEach(
      (k) =>
        product[k as keyof ProductUpdateArgs["product"]] == null &&
        delete product[k as keyof ProductUpdateArgs["product"]]
    );

    return {
      userErrors: [],
      product: await prisma.product.update({
        data: {
          title,
          content,
        },
        where: {
          id: productId,
        },
      }),
    };
  },

  productDelete: async (
    _: any,
    { productId }: { productId: string },
    { prisma }: Context
  ): Promise<ProductPayload> => {
    const checkProduct = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!checkProduct) {
      throw new UserInputError("product does not exist");
    }

    return {
      userErrors: [],
      product: await prisma.product.delete({ where: { id: productId } }),
    };
  },

  productSetPublishStatus: async (
    _: any,
    { id, status }: productSetPublishStatusArgs,
    { prisma, user }: Context
  ): Promise<ProductPayload> => {
    if (!user) {
      throw new GraphQLError("user is not authenticated", {
        extensions: {
          code: "UNAUTHENTICATED",
        },
      });
    }

    const { userId, email, phoneNumber } = user;

    const productInfo = await prisma.product.findFirst({
      where: {
        ownerId: userId,
      },
    });

    if (!productInfo)
      return {
        userErrors: [{ message: "product is not available" }],
        product: null,
      };

    const product = await prisma.product.update({
      where: {
        id,
      },
      data: {
        published: status,
      },
    });

    return { userErrors: [], product };
  },
};

