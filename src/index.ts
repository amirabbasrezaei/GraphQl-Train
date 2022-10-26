import { ApolloServer } from "@apollo/server";
import { expressMiddleware } from "@apollo/server/express4";
import { ApolloServerPluginDrainHttpServer } from "@apollo/server/plugin/drainHttpServer";
import express, { Request, Response } from "express";
import http from "http";
import cors from "cors";
import { json } from "body-parser";
import { typeDefs } from "../schema";
import { Mutation, Query, User } from "./resolvers";
import { Prisma, PrismaClient } from ".prisma/client";
import { getUser } from "./utils/getUser";
import cookieParser from "cookie-parser";
import { setToken } from "./utils/setToken";
export interface Context {
  prisma: PrismaClient<
    Prisma.PrismaClientOptions,
    never,
    Prisma.RejectOnNotFound | Prisma.RejectPerOperation | undefined
  >;
  res: Response;
  user: {
    userId: string;
    email?: string;
    phoneNumber?: string;
  } | null;
}

export const prisma = new PrismaClient();

async function startApolloServer() {
  const app = express();
  app.use(cookieParser())
  const httpServer = http.createServer(app);
  const server = new ApolloServer<Context>({
    typeDefs,
    resolvers: { Mutation, Query, User },
    plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
  });
  await server.start();

  app.use(
    "/graphql",
    cors<cors.CorsRequest>({
      origin: ["https://studio.apollographql.com", "http://localhost:4000"],
      credentials: true
    }),
    json(),
    expressMiddleware(server, {
      context: async ({ req, res }: {req: Request, res: Response}): Promise<Context> => {
        const user =  getUser(req?.cookies["accessToken"])
        if(user) setToken(user, res)
        // console.log(user)
        return { prisma, res, user };
      },
    })
  );

  await new Promise<void>((resolve) =>
    httpServer.listen({ port: 4000 }, resolve)
  );
  console.log(`🚀 Server ready at http://localhost:4000/graphql`);
}


startApolloServer()