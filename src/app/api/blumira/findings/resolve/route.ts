import { NextRequest, NextResponse } from "next/server";
import {
  getAccessToken,
  resolveAccountFinding,
} from "@/lib/blumira-api";

export const dynamic = "force-dynamic";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { accountId, findingId, resolution, resolutionNotes } = body;

    if (!accountId || !findingId || !resolution) {
      return NextResponse.json(
        { error: "accountId, findingId, and resolution are required" },
        { status: 400 }
      );
    }

    const token = await getAccessToken();
    const result = await resolveAccountFinding(
      token,
      accountId,
      findingId,
      resolution,
      resolutionNotes
    );

    return NextResponse.json({ data: result });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
