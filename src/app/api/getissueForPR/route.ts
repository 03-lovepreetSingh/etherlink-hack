import { NextResponse } from 'next/server';
import { db } from '../../../db/index';
import { issues } from '../../../db/schema';
import { eq } from 'drizzle-orm';
import { and } from 'drizzle-orm';


export async function GET(request:Request) {
    const url = new URL(request.url);
    const project_repository = url.searchParams.get('project_repository');
    const issueNumber = url.searchParams.get('issueNumber');

    if (!project_repository) {
        return NextResponse.json({ error: 'project_repository is required' }, { status: 400 });
    }
    if (!issueNumber) {
        return NextResponse.json({ error: 'issueNumber is required' }, { status: 400 });
    }

    try {
        const projectsData = await db
        .select()
        .from(issues)
        .where(
            and(
            eq(issues.project_repository, project_repository),
            eq(issues.project_issues, issueNumber)
            )
        )
        .orderBy(issues.priority);
        return NextResponse.json({ projects: projectsData });
    } catch (error) {
        console.error('Error fetching projects:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}

export async function PUT(request: Request) {
    const url = new URL(request.url);
    const project_repository = url.searchParams.get('project_repository');
    const issueNumber = url.searchParams.get('issueNumber');

    if (!project_repository) {
        return NextResponse.json({ error: 'project_repository is required' }, { status: 400 });
    }
    if (!issueNumber) {
        return NextResponse.json({ error: 'issueNumber is required' }, { status: 400 });
    }

    try {
        const body = await request.json();
        const {
            issue_name,
            issue_url,
            publisher,
            issue_description,
            issue_date,
            Difficulty,
            priority,
            rewardAmount,
            active
        } = body;

        // Build update object with only provided fields
        const updateData: any = {};
        if (issue_name !== undefined) updateData.issue_name = issue_name;
        if (issue_url !== undefined) updateData.issue_url = issue_url;
        if (publisher !== undefined) updateData.publisher = publisher;
        if (issue_description !== undefined) updateData.issue_description = issue_description;
        if (issue_date !== undefined) updateData.issue_date = issue_date;
        if (Difficulty !== undefined) updateData.Difficulty = Difficulty;
        if (priority !== undefined) updateData.priority = priority;
        if (rewardAmount !== undefined) updateData.rewardAmount = rewardAmount;
        if (active !== undefined) updateData.active = active;

        // Check if there's anything to update
        if (Object.keys(updateData).length === 0) {
            return NextResponse.json({ error: 'No valid fields provided for update' }, { status: 400 });
        }

        const result = await db
            .update(issues)
            .set(updateData)
            .where(
                and(
                    eq(issues.project_repository, project_repository),
                    eq(issues.project_issues, issueNumber)
                )
            )
            .returning();

        if (result.length === 0) {
            return NextResponse.json({ error: 'Issue not found' }, { status: 404 });
        }

        return NextResponse.json({ 
            message: 'Issue updated successfully', 
            updatedIssue: result[0] 
        });
    } catch (error) {
        console.error('Error updating issue:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}