// pages/api/getuser.ts
import { NextApiRequest, NextApiResponse } from "next";
const formidable = require("formidable");
import db from "@/modules/db";
import { verifyToken } from "../../../utils/verifyToken";
import { hashPassword } from "../create";
import saveFile from "@/utils/file";
import { StepStatus } from "@prisma/client"; // Import Ste
async function handleDiploma(req: NextApiRequest, res: NextApiResponse) {
  const token = req.headers.authorization || req.query.token || "";

  const userId = verifyToken(token as string);

  if (!userId) {
    return res.status(401).json({ message: "Unauthorized access" });
  }

  const form = new formidable.IncomingForm();

  const { fields, files } = await saveFile(req, true);

  const { teacherId, stepNumber, stepStatus, finalPoints, name, diplomaId } =
    fields as any;

  console.log(fields);
  try {
    const { diploma_file } = files;
    const firstFile = (files as any).diploma[0];
    const size = firstFile.size;
    const filepath = firstFile.filepath;
    const newFilename = firstFile.newFilename;
    const originalFilename = firstFile.originalFilename;

    const finalFilePath = "http://localhost:3000/diploma/" + newFilename;

    // Create or update diploma
    if (diplomaId[0]) {
      let oldDiploma = await db.diploma.update({
        where: { id: +`${userId}` }, // Assuming you want to update by studentId
        data: {
          student: { connect: { id: +userId } }, // Assuming you have studentId in fields
          teacher: { connect: { id: +teacherId[0] } }, // Assuming you have teacherId in fields
          name: name[0],
          finalPoints: +finalPoints
        }
      });

      let steps = await db.step.findMany({
        where: {
          diplomaId: +diplomaId
        }
      });

      // Define the new or updated step data
      const stepData = {
        diplomaId: oldDiploma.id,
        status: stepStatus || "REJECTED",
        file: finalFilePath,
        stepNumber: +stepNumber[0]
      };

      let existingStep = steps.find((s) => s.stepNumber === +stepNumber[0]);

      if (existingStep) {
        await db.step.update({
          where: {
            id: existingStep.id
          },
          data: {
            status: stepStatus
          }
        });
      } else {
        await db.step.create({
          data: stepData
        });
      }
      return res.status(200).json({ message: "Diploma updated successfully" });
    } else {
      let newDiploma = await db.diploma.create({
        data: {
          student: { connect: { id: +userId } }, // Assuming you have studentId in fields
          teacher: { connect: { id: +teacherId[0] } }, // Assuming you have teacherId in fields

          name: name[0],
          status: "PENDING", // Assuming status is provided in fields
          finalPoints: +0
        }
      });
      const stepsDatas = [
        {
          diplomaId: newDiploma.id,
          status: StepStatus.REJECTED,
          file: finalFilePath,
          stepNumber: 1
        }
      ];
      for (const stepData of stepsDatas) {
        await db.step.create({ data: stepData as any });
      }

      return res.status(200).json({ message: "Diploma created successfully" });
    }
  } catch (error) {
    console.error("Error creating/updating diploma:", error);
    res.status(400).json({ message: "Bad Request" });
  }
}

export const config = {
  api: {
    bodyParser: false
  }
};

export default handleDiploma;
