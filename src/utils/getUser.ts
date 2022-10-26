import JWT from "jsonwebtoken";

export interface getUserPayload {
  userId: string;
  email?: string;
  phoneNumber?: string;
}

export const getUser = (token: string) => {
  try {
    return JWT.verify(
      token,
      process.env["JWT_SECRET"] as string
    ) as getUserPayload;
  } catch (error) {
    return null;
  }
};
