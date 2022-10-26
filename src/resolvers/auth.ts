import { User } from "@prisma/client";
import { Context } from "../index";
import { compare, hash } from "bcrypt";
import validator from "validator";
import JWT from "jsonwebtoken";
import { setToken } from "../utils/setToken";

/// signUp Interfaces

interface signUpArgs {
  userIdentity: userIdentityType;
}

interface userIdentityType {
  email?: string;
  phoneNumber?: string;
  password: string;
}

interface UserErrorsType {
  message: string;
}

interface signUpPayoad {
  userErrors: UserErrorsType[];
  token: string | null;
}

/// signIn Interfaces
interface signInArgs {
  userIdentity: userIdentityType;
  password: string;
}

interface signInPayoad {
  userErrors: UserErrorsType[];
  token: string | null;
}

export const authResolvers = {
  signup: async (
    _: any,
    { userIdentity }: signUpArgs,
    { prisma }: Context
  ): Promise<signUpPayoad> => {
    const { phoneNumber, email, password } = userIdentity || {};
    const hashedPassword = await hash(password, 10);

    let createdUser: User | null = null;

    const isPasswordValid = validator.isLength(password, {
      min: 8,
    });

    if (!isPasswordValid) {
      return {
        token: null,
        userErrors: [{ message: "password is not correct" }],
      };
    }

    if (email && !phoneNumber) {
      const checkEmail = validator.isEmail(email);

      if (!checkEmail)
        return {
          token: null,
          userErrors: [{ message: "email is not correct" }],
        };

      const isEmailAvailable = await prisma.user.findUnique({
        where: {
          email,
        },
      });

      if (isEmailAvailable)
        return {
          userErrors: [{ message: "there is user with this email" }],
          token: null,
        };

      createdUser = await prisma.user.create({
        data: {
          password: hashedPassword,
          email,
        },
      });
    }

    if (!email && phoneNumber) {
      const isPhoneNumberAvailable = await prisma.user.findUnique({
        where: {
          phoneNumber,
        },
      });

      if (isPhoneNumberAvailable)
        return {
          userErrors: [{ message: "there is user with this phonenumber" }],
          token: null,
        };
        
      createdUser = await prisma.user.create({
        data: {
          password: hashedPassword,
          phoneNumber,
        },
      });
    }

    const token = JWT.sign(
      {
        userId: createdUser?.id,
        phoneNumber: createdUser?.phoneNumber,
        email: createdUser?.email,
      },
      process.env["JWT_SECRET"] as string,
      {
        expiresIn: 360000,
      }
    );

    return { token: token, userErrors: [] };
  },

  signin: async (
    _: any,
    { userIdentity }: signInArgs,
    { prisma, res }: Context
  ): Promise<signInPayoad> => {
    const { email, phoneNumber, password } = userIdentity;

    const user = await prisma.user.findUnique({
      where: {
        email,
        phoneNumber,
      },
    });

    if (!user)
      return {
        userErrors: [{ message: "user credentials arent correct" }],
        token: null,
      };

    const isPasswordValid = await compare(password, user.password);

    if (!isPasswordValid)
      return {
        userErrors: [{ message: "user credentials arent correct" }],
        token: null,
      };

    console.log(isPasswordValid);

    const token = JWT.sign(
      {
        userId: user.id,
        phoneNumber: user?.phoneNumber,
        email: user?.email,
      },
      process.env["JWT_SECRET"] as string,
      {
        expiresIn: 360000,
      }
    );


    
    setToken({userId: user.id, email, phoneNumber }, res)

    return { userErrors: [], token };
  },
};
