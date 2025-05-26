import { NextResponse } from "next/server";
import db from "../../../../../db"; 
import { getServerSession } from "next-auth";
import { authOptions } from "@/pages/api/auth/[...nextauth]";
import { v4 as uuidv4 } from "uuid";

interface NewsData {
  articleId: string;
  title: string;
  description: string;
  sphoto: string;
  lphoto: string;
  type: string;
  source: string;
  sourceLink: string;
  link: string;
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || session.user?.role !== "admin") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
  }

  try {
    const data: NewsData = await request.json();
    let { articleId, title, description, sphoto, lphoto, type, source, sourceLink, link } = data;

    // Generate articleId if not provided
    if (!articleId) {
      articleId = uuidv4(); // You can use a library to generate a unique ID
    }

    // Insert the news article into the database
    await db("news").insert({
      ArticleId: articleId,
      Title: title,
      Description: description,
      Sphoto: sphoto,
      Lphoto: lphoto,
      Type: type,
      Source: source,
      SourceLink: sourceLink,
      Link: link,
    });

    console.log("articleId: ", articleId, "title:", title, "description:", description, "sphoto:", sphoto, "lphoto:", lphoto, "type:", type, "source:", source, "sourceLink:", sourceLink, "link:",link)

    return NextResponse.json({ message: "News added successfully" });
  } catch (error) {
    console.error("Error adding news:", error);
    return NextResponse.json({ error: error }, { status: 500 });
  }
}