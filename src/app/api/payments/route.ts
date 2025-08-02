import { NextResponse, NextRequest } from "next/server";
import { db } from '../../../db/index';
import { payments } from '../../../db/schema';
import { eq } from 'drizzle-orm';
interface Payment {
    amount: string;
    username:string;

}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: NextRequest): Promise<NextResponse> {
  try {
    const body = await request.json() as Payment;
    const { amount , username} = body;

    if (!amount) {
      return errorResponse("Amount is required");
    }

    const amountNumber = parseFloat(amount);
    if (isNaN(amountNumber)) {
      return errorResponse("Invalid amount value");
    }

    const result = await db.insert(payments).values({
      amount: amountNumber,
      username
    }).returning();

    return NextResponse.json({
      success: true,
      message: 'Payment Successful',
      payment: result[0]
    });

  } catch (error) {
    console.error('Error creating payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return errorResponse(`Failed to process payment: ${errorMessage}`, 500);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");
    
    if (!username) {
      return errorResponse("Username parameter is required");
    }

    const paymentsData = await db.select().from(payments).where(eq(payments.username, username));

    return NextResponse.json({
      success: true,
      payments: paymentsData
    });
  } catch (error) {
    console.error('Error retrieving entry:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    return errorResponse(`Failed to retrieve entry: ${errorMessage}`, 500);
  }
}