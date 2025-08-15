import { trending } from "@/lib/google-trends";
import { NextRequest, NextResponse } from "next/server";

// Fallback trending data when Google Trends is unavailable
const fallbackTrendingData = {
  dailyTrends: [
    { title: "AI-powered productivity tools", formattedTraffic: "2M+" },
    { title: "Sustainable fashion brands", formattedTraffic: "1.5M+" },
    { title: "Smart home automation", formattedTraffic: "3M+" },
    { title: "Vintage collectibles marketplace", formattedTraffic: "800K+" },
    { title: "Plant-based protein products", formattedTraffic: "1.2M+" },
    { title: "Digital art NFT marketplace", formattedTraffic: "600K+" },
  ],
  realTimeTrends: [
    { title: "Wireless charging accessories", entityNames: ["Technology"] },
    { title: "Skincare routine essentials", entityNames: ["Beauty"] },
    { title: "Gaming chair ergonomics", entityNames: ["Gaming"] },
    { title: "Coffee subscription services", entityNames: ["Food & Drink"] },
  ],
};

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const geo = searchParams.get("geo") || process.env.DEFAULT_GEO || "AU";
    const mode = (searchParams.get("mode") || "both") as
      | "daily"
      | "realtime"
      | "both";
    const category = searchParams.get("category") || "b";

    let dailyTrends = [];
    let realTimeTrends = [];

    if (mode === "daily" || mode === "both") {
      const dailyData = await trending(geo, "daily", category);
      if (dailyData?.default?.trendingSearchesDays?.[0]?.trendingSearches) {
        dailyTrends = dailyData.default.trendingSearchesDays[0].trendingSearches
          .slice(0, 6)
          .map((trend: any) => ({
            title: trend.title.query,
            formattedTraffic: trend.formattedTraffic || "N/A",
          }));
      }
    }

    if (mode === "realtime" || mode === "both") {
      const realtimeData = await trending(geo, "realtime", category);
      if (realtimeData?.storySummaries?.trendingStories) {
        realTimeTrends = realtimeData.storySummaries.trendingStories
          .slice(0, 4)
          .map((story: any) => ({
            title: story.title,
            entityNames: story.entityNames || [],
          }));
      }
    }

    // If we couldn't get real data, use fallback
    if (dailyTrends.length === 0 && realTimeTrends.length === 0) {
      console.log("Using fallback trending data due to API limitations");
      return NextResponse.json(fallbackTrendingData);
    }

    return NextResponse.json({
      dailyTrends:
        dailyTrends.length > 0 ? dailyTrends : fallbackTrendingData.dailyTrends,
      realTimeTrends:
        realTimeTrends.length > 0
          ? realTimeTrends
          : fallbackTrendingData.realTimeTrends,
    });
  } catch (error) {
    console.error("Trending API error:", error);
    console.log("Returning fallback data due to error");
    return NextResponse.json(fallbackTrendingData);
  }
}
