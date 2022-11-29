import { Product, User as  UserType } from "@prisma/client";
import { Context } from "../index";
import { userQueryResolvers } from "./user";

export const Query = {
  ...userQueryResolvers,
};

export const User = {
};
