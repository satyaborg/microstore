import { NextRequest, NextResponse } from "next/server";

interface AdFormData {
  headline: string;
  description: string;
  imageUrl: string;
  cta: string;
  dailyBudget: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: AdFormData = await request.json();

    // Validate required fields
    if (!body.headline || !body.description || !body.imageUrl) {
      return NextResponse.json(
        {
          error:
            "Missing required fields: headline, description, and imageUrl are required",
        },
        { status: 400 }
      );
    }

    // Simulate API processing delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Mock Meta API response with realistic IDs
    const mockResponse = {
      campaignId: `camp_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 6)}`,
      adSetId: `adset_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      creativeId: `creative_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 6)}`,
      adId: `ad_${Date.now()}_${Math.random().toString(36).substr(2, 6)}`,
      status: "PAUSED",
      message: "Ad campaign created successfully in PAUSED status",
    };

    // Log the mock creation for development
    console.log("Mock Meta Ad Created:", {
      headline: body.headline,
      description: body.description,
      cta: body.cta,
      dailyBudget: body.dailyBudget,
      response: mockResponse,
    });

    return NextResponse.json(mockResponse);
  } catch (error) {
    console.error("Error in Meta launch endpoint:", error);

    return NextResponse.json(
      { error: "Failed to create ad campaign. Please try again." },
      { status: 500 }
    );
  }
}
