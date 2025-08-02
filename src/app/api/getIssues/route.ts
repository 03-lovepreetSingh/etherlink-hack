import { NextResponse } from "next/server";
import { db } from "../../../db/index";
import { issues } from "../../../db/schema";
import { eq } from "drizzle-orm";


export async function GET(request: Request) {
  const url = new URL(request.url);
  const publisher = url.searchParams.get("publisher");

  if (!publisher) {
    return NextResponse.json(
      { error: "publisher is required" },
      { status: 400 }
    );
  }

  try {
    const projectsData = await db
      .select()
      .from(issues)
      .where(eq(issues.publisher, publisher))
      .orderBy(issues.priority);
    return NextResponse.json({ projects: projectsData });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
