import { NextResponse } from "next/server";
import { db } from "../../../db/index";
import { wallet } from "../../../db/schema";
import { eq } from "drizzle-orm";
import Decimal from "decimal.js";

// Type inference
type Wallet = typeof wallet.$inferSelect;
type NewWallet = typeof wallet.$inferInsert;

// Interface for input
interface WalletInput {
  id: string;
  walletBalance: string;
}

// Reusable error response
function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

// ✅ POST: Create new wallet
export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as WalletInput;
    const { id, walletBalance } = body;

    if (!id) return errorResponse("Missing 'id' field");
    const balance = new Decimal(walletBalance || "0");

    // Check if wallet already exists
    const existing = await db.select().from(wallet).where(eq(wallet.id, id));
    if (existing.length > 0) {
      return errorResponse("Wallet already exists", 409);
    }

    const newWallet: NewWallet = {
      id,
      walletBalance: balance.toString(),
    };

    await db.insert(wallet).values(newWallet);

    return NextResponse.json(
      { success: true, data: newWallet },
      { status: 201 }
    );
  } catch (err: any) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}

// ✅ PATCH: Update wallet balance
export async function PATCH(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as WalletInput;
    const { id, walletBalance } = body;

    if (!id) return errorResponse("Missing 'id' field");
    if (walletBalance === undefined)
      return errorResponse("Missing 'walletBalance' field");

    const current = await db.select().from(wallet).where(eq(wallet.id, id));

    if (current.length === 0) return errorResponse("Wallet not found", 404);

    // Perform safe arithmetic using Decimal
    const newBalance = new Decimal(walletBalance);

    const updated = await db
      .update(wallet)
      .set({ walletBalance: newBalance.toString() })
      .where(eq(wallet.id, id))
      .returning();

    return NextResponse.json({ success: true, data: updated[0] });
  } catch (err: any) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}

// ✅ GET: Fetch wallet by ID (query param: ?id=xyz)
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get("id");

    if (!id) return errorResponse("Missing 'id' in query params");

    const result = await db.select().from(wallet).where(eq(wallet.id, id));

    if (result.length === 0) return errorResponse("Wallet not found", 404);

    return NextResponse.json({ success: true, data: result[0] });
  } catch (err: any) {
    console.error(err);
    return errorResponse("Internal server error", 500);
  }
}
