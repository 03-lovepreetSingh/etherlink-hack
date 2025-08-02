import { NextResponse } from "next/server";
import { db } from "../../../db/index";
import { issues } from "../../../db/schema";

import { eq, and } from "drizzle-orm";

export async function POST(request: Request) {
  try {
    const {
      email,
      priority,
      issue_name,
      issue_description,
      issue_date,
      project_repository,
      issue_url,
      difficulty,
      rewardAmount,
      project_issues,
    } = await request.json();
    // First insert the project
    const [{ issue_id: createdIssueId }] = await db
      .insert(issues)
      .values({
        issue_name,
        issue_description,
        issue_date,
        project_repository,
        issue_url,
        project_issues,
        Difficulty: difficulty,
        rewardAmount,
        priority,
      })
      .returning({ issue_id: issues.id });

    console.log("Created Issue ID:", createdIssueId);

    try {
      // Send webhook to n8n
      const response = await fetch(
        "https://n8n-h04ks0s0kk0kw0ocws0socsk.server.openwave.tech/webhook/43c1a3aa-c87d-4e66-a109-51e8412dbffc",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            n8n_condition: "create-issue",
            email: email,
            issue_id: createdIssueId,
          }),
        }
      );

      return NextResponse.json({
        success: true,
        issue_id: createdIssueId,
        message: "Issue created and webhook sent successfully",
      });
    } catch (emailError) {
      console.error("Webhook/Email sending failed:", emailError);

      return NextResponse.json({
        success: true,
        issue_id: createdIssueId,
        emailSent: false,
        error: "Issue created but webhook/email notification failed",
      });
    }

    // Then send email notification
    // try {
    //     const info = await transporter.sendMail({
    //         from: 'openwave@gdggtbit.in',
    //         to: email,
    //         subject: 'New Project Added on openwave!',
    //         html: `
    //             <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
    //                 <p><strong>Difficulty:</strong> ${difficulty}</p>
    //                 <p><strong>Reward Amount:</strong> ${rewardAmount} PAHROS</p>
    //                 <p><strong>Repository:</strong> ${project_repository}</p>
    //                 <hr>
    //                 <p>Visit openwave to learn more and start contributing!</p>
    //             </div>
    //         `
    //     });

    //     return NextResponse.json({
    //         success: true,
    //         emailSent: info.accepted.length > 0,
    //         messageId: info.messageId
    //     });

    // } catch (emailError) {
    //     console.error('Email sending failed:', emailError);
    //     // Return success true because project was created even if email failed
    //     return NextResponse.json({
    //         success: true,
    //         emailSent: false,
    //         error: 'Project created but notification email failed'
    //     });
    // }
  } catch (error) {
    console.error("Error in project creation:", error);
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  const url = new URL(request.url);
  const project_repository = url.searchParams.get("project_repository");

  if (!project_repository) {
    return NextResponse.json(
      { error: "project_repository is required" },
      { status: 400 }
    );
  }

  try {
    const projectsData = await db
      .select()
      .from(issues)
      .where(
        and(
          eq(issues.project_repository, project_repository),
          eq(issues.active, true)
        )
      )
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
