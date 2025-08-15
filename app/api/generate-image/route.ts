import { NextRequest, NextResponse } from "next/server";

interface ImageGenerationRequest {
  headline: string;
  description: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: ImageGenerationRequest = await request.json();
    
    if (!body.headline) {
      return NextResponse.json(
        { error: "Headline is required for image generation" },
        { status: 400 }
      );
    }

    // Simulate AI processing delay
    await new Promise(resolve => setTimeout(resolve, 2500));

    // Mock AI image generation with different placeholder styles
    const colors = [
      "4F46E5/white", // Blue
      "059669/white", // Green  
      "DC2626/white", // Red
      "7C3AED/white", // Purple
      "EA580C/white"  // Orange
    ];
    
    const colorIndex = body.headline.length % colors.length;
    const selectedColor = colors[colorIndex];
    
    // Create mock "AI generated" image URL with headline text
    const encodedText = encodeURIComponent(body.headline.slice(0, 20));
    const imageUrl = `https://via.placeholder.com/400x300/${selectedColor}?text=${encodedText}`;
    
    console.log("Mock AI Image Generated:", {
      headline: body.headline,
      description: body.description,
      generatedUrl: imageUrl
    });

    return NextResponse.json({
      imageUrl,
      prompt: `AI-generated image for: "${body.headline}"`,
      style: "Professional advertising style",
      processingTime: "2.5s"
    });
    
  } catch (error) {
    console.error("Error in image generation endpoint:", error);
    
    return NextResponse.json(
      { error: "Failed to generate image. Please try again." },
      { status: 500 }
    );
  }
}