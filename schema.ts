import { gql } from "apollo-server";

export const typeDefs = gql`
  type Query {
    users: [User!]
  }

  type Mutation {
    signup(userIdentity: userIdentityInput!): signUpPayoad!
    signin(userIdentity: userIdentityInput!): signInPayoad!
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

  type UserErrorsType {
    message: String!
  }

  type User {
    id: ID!
    name: String
    familyName: String
    email: String
    phoneNumber: String
  }
`;
