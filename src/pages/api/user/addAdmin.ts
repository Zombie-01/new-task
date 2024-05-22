// pages/api/getuser.ts
import { NextApiRequest, NextApiResponse } from "next";
const formidable = require("formidable");
import db from "@/modules/db";
import { verifyToken } from "../../../utils/verifyToken";
import { hashPassword } from "../create";
import saveFile from "@/utils/file";
async function handleUser(req: NextApiRequest, res: NextApiResponse) {
  const form = new formidable.IncomingForm();

  form.parse(req, async (err: any, fields: any) => {
    if (err) {
      return res.status(400).json({ message: "Error parsing form data" });
    }

    const data = { username: "ADMIN", role: "TEACHER", password: "123" };

    const { username, role, password } = data;

    try {
      if (!username || !role || !password) {
        return res.status(400).json({ message: "Missing required fields" });
      }

      const hashedPassword = hashPassword(password);

      // Create new user
      await db.userD.create({
        data: {
          username: username,
          role: role as any,
          password_hash: hashedPassword
        }
      });
      return res.status(200).json({ message: "User created successfully" });
    } catch (error) {
      console.error("Error creating/updating user:", error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  });
}

export const config = {
  api: {
    bodyParser: false
  }
};

export default handleUser;
