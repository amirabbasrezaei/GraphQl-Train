import { Response } from "express";
import { sign } from "jsonwebtoken";
import { getUserPayload } from "./getUser";

interface setTokenArgs {
    userId: string;
    email?: string;
    phoneNumber?: string;
}

export const setToken = (user: getUserPayload, res: Response) => {
  // if(user.)
  const token = sign(user, process.env["JWT_SECRET"] as string);
  res.cookie("accessToken", token, { maxAge: 900000,sameSite: "none",  httpOnly: true, secure: process.env.NODE_ENV === 'production' });
//   console.log(cookie)
};
