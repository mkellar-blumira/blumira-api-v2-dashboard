import { NextRequest, NextResponse } from "next/server";
import {
  getAccessToken,
  addAccountFindingComment,
} from "@/lib/blumira-api";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, findingId, comment, sender } = body;

    if (!accountId || !findingId || !comment) {
      return NextResponse.json(
        { error: "accountId, findingId, and comment are required" },
        { status: 400 }
      );
    }

    const token = await getAccessToken();
    const result = await addAccountFindingComment(
      token,
      accountId,
      findingId,
      comment,
      sender || "dashboard"
    );

    return NextResponse.json({ data: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
