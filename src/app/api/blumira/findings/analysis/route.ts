import { NextRequest, NextResponse } from "next/server";
import {
  getAccessToken,
  fetchFindingDetail,
  fetchAccountFindingComments,
  fetchResolutions,
} from "@/lib/blumira-api";

export const dynamic = "force-dynamic";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const accountId = searchParams.get("accountId");
    const findingId = searchParams.get("findingId");

    if (!accountId || !findingId) {
      return NextResponse.json(
        { error: "accountId and findingId are required" },
        { status: 400 }
      );
    }

    const token = await getAccessToken();

    const [finding, comments, resolutions] = await Promise.all([
      fetchFindingDetail(token, accountId, findingId),
      fetchAccountFindingComments(token, accountId, findingId),
      fetchResolutions(token),
    ]);

    if (!finding) {
      return NextResponse.json(
        { error: "Finding not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      finding,
      comments,
      resolutions,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
