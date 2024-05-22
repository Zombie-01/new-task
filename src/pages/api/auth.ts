import { SHA256 as sha256 } from "crypto-js";
import db from "@/modules/db";
import { hashPassword } from "./create";
import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "POST") {
    await loginUserHandler(req, res);
  } else {
    return res.status(405);
  }
}

async function loginUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const { username, password } = req.body as {
    username: string;
    password: string;
  };
  if (!username || !password) {
    return res.status(400).json({ message: "invalid inputs" });
  }
  try {
    const user: any = await db.userD.findFirst({
      where: { username: username },
      select: {
        id: true,
        username: true,
        role: true,
        password_hash: true
      }
    });

    if (user && user?.password_hash === hashPassword(password)) {
      const token = generateToken({
        userId: `${user.id}`,
        role: user.role
      });
      return res
        .status(200)
        .json({ ...exclude(user, ["password"]), token, ...user });
    } else {
      return res.status(401).json({ message: "invalid credentials" });
    }
  } catch (e) {
    throw new Error(e as string);
  }
}

function exclude(user: any, keys: string[]) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}

function generateToken({ userId, role }: { userId: string; role: string }) {
  const secretKey =
    "eyJhbGciOiJIUzI1NiJ9.eyJSb2xlIjoiQWRtaW4iLCJJc3N1ZXIiOiJJc3N1ZXIiLCJVc2VybmFtZSI6IkphdmFJblVzZSIsImV4cCI6MTY5OTk1ODMyNCwiaWF0IjoxNjk5OTU4MzI0fQ.NTfLs3f64f6y390SsjEq8Zg7G3mMUK9dxnE0OcB4Qcs";
  const token = jwt.sign({ userId, role }, secretKey, { expiresIn: "1h" });
  return token;
}
