import { contributorRequests } from "../../../db/schema";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "../../../db/index";

export async function GET(request: Request) {
  const url = new URL(request?.url);
  const contributor = url.searchParams.get("contributor");

  if (!contributor) {
    return NextResponse.json(
      { error: "contributor is required" },
      { status: 400 },
    );
  }

  try {
    const projectsData = await db
      .select()
      .from(contributorRequests)
      .where(and(eq(contributorRequests.Contributor_id, contributor),
              eq(contributorRequests.status, "assigned")
    ));
    return NextResponse.json({ project: projectsData });
  } catch (error) {
    console.error("Error fetching projects:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 },
    );
  }
}

export async function PUT(request: Request) {
  try {
    const { projectName, status ,Contributor,issue} = await request.json();

    // Check if required fields are present
    if (!projectName || !status || !Contributor || !issue) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required fields",
        },
        { status: 400 },
      );
    }

    // Update the status for the given id
    await db
      .update(contributorRequests)
      .set({ status: status })
      .where(and(eq(contributorRequests.projectName, projectName),eq(contributorRequests.issue,issue),eq(contributorRequests.Contributor_id,Contributor),eq(contributorRequests.status,"assigned")));

    return NextResponse.json(
      {
        success: true,
        message: "Status updated successfully",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating status:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    );
  }
}

