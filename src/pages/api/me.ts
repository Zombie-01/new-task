import db from "@/modules/db";
import { verifyToken } from "@/utils/verifyToken";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handle(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method === "GET") {
    await getUserHandler(req, res);
  } else {
    return res.status(405).json({ message: "Method Not Allowed" });
  }
}

async function getUserHandler(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization || req.query.token || "";

  const userId = verifyToken(token as string);
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  try {
    const user_data = await db.userD.findUnique({
      where: { id: +userId }
    });
    let result: any;
    if (user_data?.role === "STUDENT") {
      result = await db.diploma.findMany({
        where: {
          studentId: user_data?.id
        },
        select: {
          finalPoints: true,
          steps: true,
          teacherId: true,
          name: true,
          id: true
        }
      });
    } else {
      result = await db.diploma.findMany({
        where: {
          teacherId: user_data?.id
        },
        select: {
          finalPoints: true,
          steps: true,
          teacherId: true,
          name: true,
          id: true
        }
      });
    }

    return res.status(200).json({ ...user_data, data: result });
  } catch (e) {
    console.error(e);
    return res.status(500).json({ message: "Internal Server Error" });
  }
}

function exclude(user: any, keys: string[]) {
  for (let key of keys) {
    delete user[key];
  }
  return user;
}
