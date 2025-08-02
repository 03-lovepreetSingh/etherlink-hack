import { NextResponse } from "next/server";
import { db } from "../../../db/index";
import { wallet, walletTransactions } from "../../../db/schema";
import { eq, desc } from "drizzle-orm";
import Decimal from "decimal.js";

// Type inference
type WalletTransaction = typeof walletTransactions.$inferSelect;
type NewWalletTransaction = typeof walletTransactions.$inferInsert;

interface WalletTransactionsInput {
  username: string;
  amount: string;
  transactionType: "receive" | "withdraw";
  timestamp: Date;
}

function errorResponse(message: string, status = 400) {
  return NextResponse.json({ success: false, error: message }, { status });
}

export async function POST(request: Request): Promise<NextResponse> {
  try {
    const body = (await request.json()) as WalletTransactionsInput;
    const { username, amount, transactionType } = body;

    if (!username || !amount || !transactionType) {
      return errorResponse("Missing required fields", 400);
    }

    const type = transactionType.toLowerCase();
    if (type !== "receive" && type !== "withdraw") {
      return errorResponse("Invalid transaction type", 400);
    }

    const existingWallet = await db
      .select()
      .from(wallet)
      .where(eq(wallet.id, username));

    if (existingWallet.length === 0) {
      return errorResponse("Wallet does not exist for this user", 404);
    }

    const currentBalance = new Decimal(existingWallet[0].walletBalance || "0");
    const amountDecimal = new Decimal(amount);

    let newBalance: Decimal;
    if (type === "receive") {
      newBalance = currentBalance.add(amountDecimal);
    } else {
      if (amountDecimal.gt(currentBalance)) {
        return errorResponse("Insufficient balance", 400);
      }
      newBalance = currentBalance.sub(amountDecimal);
    }

    const newTransaction: NewWalletTransaction = {
      username,
      amount: amountDecimal.toString(),
      transactionType: type,
    };

    await db.insert(walletTransactions).values(newTransaction);

    await db
      .update(wallet)
      .set({ walletBalance: newBalance.toString() })
      .where(eq(wallet.id, username));

    return NextResponse.json(
      {
        success: true,
        message: `Transaction successful and wallet updated`,
        transaction: newTransaction,
        newBalance: newBalance.toString(),
      },
      { status: 201 }
    );
  } catch (err: any) {
    console.error("POST /wallet-transactions error:", err);
    return errorResponse("Internal server error", 500);
  }
}

// GET: Fetch transactions by username
export async function GET(request: Request): Promise<NextResponse> {
  try {
    const { searchParams } = new URL(request.url);
    const username = searchParams.get("username");

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Missing 'username' query parameter" },
        { status: 400 }
      );
    }

    const transactions = await db
      .select()
      .from(walletTransactions)
      .where(eq(walletTransactions.username, username))
      .orderBy(desc(walletTransactions.timestamp));

    return NextResponse.json(
      { success: true, data: transactions },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("GET /wallet-transactions error:", err);
    return NextResponse.json(
      { success: false, error: "Internal server error" },
      { status: 500 }
    );
  }
}
