// pages/api/coworker/[diploma].ts
import db from "@/modules/db";
import { NextApiRequest, NextApiResponse } from "next";

async function getStaff(req: NextApiRequest, res: NextApiResponse) {
  const { diploma: diplomaId } = req.query;

  try {
    if (!diplomaId) {
      return res.status(404).json({ message: "Coworker ID not provided" });
    }

    const diploma = await db.diploma.findUnique({
      where: {
        id: +diplomaId
      },
      select: {
        steps: true,
        id: true,
        teacherId: true,
        student: true,
        finalPoints: true
      }
    });

    return res.status(200).json({ diploma });
  } catch (error) {
    console.error("Error fetching diploma:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export default getStaff;
