import { productMutationResolvers } from "./product";
import { authResolvers } from "./auth";
import { userMutationResolvers } from "./user";

export const Mutation = {
  ...productMutationResolvers,
  ...authResolvers,
  ...userMutationResolvers
};
