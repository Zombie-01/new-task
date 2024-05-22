  // pages/api/getuser.ts
  import { NextApiRequest, NextApiResponse } from "next";
  import db from "@/modules/db";
  import { verifyToken } from "../../../utils/verifyToken";

  async function getDiplomas(req: NextApiRequest, res: NextApiResponse) {
    // Retrieve the token from the request headers, query parameters, or wherever it's expected
    const searchText = req.query.search;
    try {
      const diplomas = await db.diploma.findMany({
        where: {
          // Assuming you have a field like 'username' to search against
          name: {
            contains: searchText ? `${searchText}` : "" // Use empty string if searchText is undefined
          }
        }
      });

      res.status(200).json(diplomas);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }

  export default getDiplomas;
