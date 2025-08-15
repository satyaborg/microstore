import { trending } from "@/lib/google-trends";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const geo = searchParams.get("geo") || process.env.DEFAULT_GEO || "AU";
    const mode = (searchParams.get("mode") || "realtime") as
      | "daily"
      | "realtime";
    const category = searchParams.get("category") || "b";
    const data = await trending(geo, mode, category);
    return NextResponse.json(data);
  } catch (error) {
    console.error("Trending API error:", error);
    return NextResponse.json(
      { error: "Failed to fetch trending data" },
      { status: 500 }
    );
  }
}
