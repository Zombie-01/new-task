// pages/api/getuser.ts
import { NextApiRequest, NextApiResponse } from "next";
import db from "@/modules/db";
import { verifyToken } from "../../../utils/verifyToken";

async function handleApproveStep(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const token = req.headers.authorization || req.query.token || "";

  const userId = verifyToken(token as string);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const { stepNumber, diplomaId } = JSON.parse(req.body);
  console.log(JSON.parse(req.body));

  if (!stepNumber || !diplomaId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  try {
    // Find the step
    const step = await db.step.findFirst({
      where: {
        diplomaId: +diplomaId,
        stepNumber: +stepNumber
      }
    });

    if (!step) {
      return res.status(404).json({ message: "Step not found" });
    }

    // Update the step status to APPROVED
    await db.step.update({
      where: { id: step.id },
      data: { status: "APPROVED" }
    });

    return res.status(200).json({ message: "Step approved successfully" });
  } catch (error) {
    console.error("Error approving step:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}

export default handleApproveStep;
