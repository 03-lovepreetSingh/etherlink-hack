import { NextRequest, NextResponse } from "next/server";
import { db } from "../../../db/index";
import { messages } from "../../../db/schema";
import { eq, and, or ,desc ,gt,lt} from "drizzle-orm";

interface MessageData {
  from: string;
  text: string;
  timestamp: string;
  to: string;
}

export async function POST(req: NextRequest) {
  const { from, text, timestamp, to } = await req.json();
  console.log("Received message:", { from, text, timestamp, to });
  try {
    const parsedTimestamp = new Date(timestamp);
    const result = await db.insert(messages).values({
      sender_id: from,
      reciever_id: to,
      timestamp: parsedTimestamp,
      text: text,
    });
    return NextResponse.json({ data: "Success" }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ error: error }, { status: 400 });
  }
}

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;
  const username = searchParams.get("username");
  const cursor = searchParams.get('cursor'); // Use cursor instead of page
  const pageSize = parseInt(searchParams.get('pageSize') || '50');
  const selectedUser = searchParams.get("selectedUser") || null
  try {
    if (!username) {
      return NextResponse.json({ error: "Username is required" }, { status: 400 });
    }

    // Build the where condition
    const whereConditions = [
      selectedUser ? 
    or(
      and(eq(messages.sender_id, username), eq(messages.reciever_id, selectedUser)),
      and(eq(messages.sender_id, selectedUser), eq(messages.reciever_id, username))
    ) :
    or(eq(messages.sender_id, username), eq(messages.reciever_id, username))
    ];

    // Add cursor condition if provided (for pagination)
    if (cursor) {
      const cursorDate = new Date(cursor);
      whereConditions.push(lt(messages.timestamp, cursorDate));
    }

    const messageData = await db
      .select()
      .from(messages)
      .where(and(...whereConditions))
      .orderBy(desc(messages.timestamp))
      .limit(pageSize + 1); // Fetch one extra to check if there are more pages

    // Check if there are more messages for pagination
    const hasMore = messageData.length > pageSize;
    const messages_result = hasMore ? messageData.slice(0, pageSize) : messageData;
    
    // Get the cursor for the next page (timestamp of the last message)
    const nextCursor = messages_result.length > 0 
      ? messages_result[messages_result.length - 1]?.timestamp?.toISOString() ?? null
      : null;

    return NextResponse.json({ 
      messages: messages_result,
      hasMore,
      nextCursor,
      total: messages_result.length
    });
  } catch (error) {
    console.error("Error fetching messages:", error);
    return NextResponse.json({ error: "Failed to fetch messages" }, { status: 500 });
  }
}

