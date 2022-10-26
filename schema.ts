import {gql} from "apollo-server"

export const typeDefs = gql`
  type Query {
    userShops: ShopPayload!
    users: [User!]
  }

  type Mutation {
    productCreate(
      title: String!
      content: String!
      shopId: String!
    ): ProductPayLoad!
    productUpdate(
      productId: String!
      product: ProductUpdateInput!
    ): ProductPayLoad!
    productDelete(productId: Int!): ProductPayLoad
    productSetPublishStatus(id: String!, status: Boolean!): ProductPayLoad
    signup(userIdentity: userIdentityInput!): signUpPayoad!
    signin(userIdentity: userIdentityInput!): signInPayoad!
    createShop(name: String!): ShopPayload!
    selectShop(shopId: Int!): ShopPayload!
    deleteShop(shopId: Int!): ShopPayload!
  }


  type ShopPayload {
    userErrors: [UserErrorsType!]!
    shop: [Shop!]!
  }

  type signUpPayoad {
    userErrors: [UserErrorsType!]!
    token: String
  }


  type signInPayoad {
    userErrors: [UserErrorsType!]!
    token: String
  }

  input userIdentityInput {
    email: String
    phoneNumber: String
    password: String!
  }

  input ProductUpdateInput {
    title: String
    content: String
  }

  type UserErrorsType {
    message: String!
  }

  type ProductPayLoad {
    userErrors: [UserErrorsType]
    product: Product
  }

  type Product {
    id: ID!
    title: String!
    content: String!
    createdAt: String!
    published: Boolean
    user: User!
    shopId: String!
    ownerId: String!
  }

  type User {
    id: ID!
    name: String
    familyName: String
    email: String
    phoneNumber: String
    profile: Profile!
    products: [Product!]
  }

  type Shop {
    id: ID!
    name: String
    ownerId: ID!
    products: [Product!]!
  }

  type Profile {
    id: ID!
    bio: String
    user: User!
  }
`;
