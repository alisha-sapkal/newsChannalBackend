import { NextApiRequest, NextApiResponse } from "next";
import db from "../../../../../db";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { articleId } = req.query;

  if (req.method === "DELETE") {
    try {
      await db("news").where({ articleId }).del();
      res.status(200).json({ message: "Article deleted successfully" });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete article" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}
