import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

function smartTruncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) {
    return text;
  }
  
  // Find the last space before the max length
  const truncated = text.slice(0, maxLength - 3); // Reserve 3 chars for "..."
  const lastSpaceIndex = truncated.lastIndexOf(' ');
  
  // If no space found, just truncate (rare edge case)
  if (lastSpaceIndex === -1) {
    return text.slice(0, maxLength - 3) + "...";
  }
  
  // Truncate at the last complete word and add ellipsis
  return truncated.slice(0, lastSpaceIndex) + "...";
}

interface CopyGenerationRequest {
  product: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: CopyGenerationRequest = await request.json();
    
    if (!body.product) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found, using mock data");
      
      // Fallback to mock data if no API key
      const mockData = generateMockCopy(body.product);
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate API delay
      
      return NextResponse.json(mockData);
    }

    try {
      const ai = new GoogleGenAI({ apiKey });

      const prompt = `Create an engaging ad copy for "${body.product}". 

      IMPORTANT: Aim for descriptions around 70-80 characters (max 90). Keep it concise and impactful!
      
      Respond with ONLY a JSON object in this exact format:
      {
        "headline": "max 40 characters compelling headline",
        "description": "70-80 characters - engaging description highlighting key benefits"
      }
      
      Make it punchy, benefit-focused, and perfect for social media ads. Shorter is better!`;

      const response = await ai.models.generateContent({
        model: "gemini-2.0-flash-exp",
        contents: prompt
      });
      const text = response.text;

      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from AI");
      }

      const aiResponse = JSON.parse(jsonMatch[0]);
      
      // Validate and truncate if needed
      const headline = aiResponse.headline ? smartTruncate(aiResponse.headline, 40) : "";
      const description = aiResponse.description ? smartTruncate(aiResponse.description, 90) : "";

      if (!headline || !description) {
        throw new Error("AI response missing required fields");
      }

      // Log if truncation was needed (monitoring)
      if (aiResponse.headline && aiResponse.headline.length > 40) {
        console.warn("AI headline truncated:", aiResponse.headline.length, "chars ->", headline.length, "chars");
      }
      if (aiResponse.description && aiResponse.description.length > 90) {
        console.warn("AI description truncated:", aiResponse.description.length, "chars ->", description.length, "chars");
      }

      console.log("Gemini AI Copy Generated:", {
        product: body.product,
        headline,
        description,
        headlineLength: headline.length,
        descriptionLength: description.length
      });

      return NextResponse.json({
        headline,
        description,
        source: "gemini-ai"
      });

    } catch (aiError) {
      console.error("Gemini AI error:", aiError);
      
      // Fallback to mock data if AI fails
      const mockData = generateMockCopy(body.product);
      return NextResponse.json({
        ...mockData,
        source: "mock-fallback",
        note: "AI service unavailable, using generated content"
      });
    }
    
  } catch (error) {
    console.error("Error in copy generation endpoint:", error);
    
    return NextResponse.json(
      { error: "Failed to generate ad copy. Please try again." },
      { status: 500 }
    );
  }
}

function generateMockCopy(product: string): { headline: string; description: string; source: string } {
  const templates = [
    {
      headline: `Best ${product} - Limited Time!`,
      description: `Premium ${product} with amazing features. Don't miss this exclusive offer!`
    },
    {
      headline: `${product} Sale - 50% Off`,
      description: `Top-rated ${product} now available. Free shipping and easy returns.`
    },
    {
      headline: `New ${product} Collection`,
      description: `Discover our latest ${product} designs. Perfect quality at great prices.`
    }
  ];
  
  const template = templates[product.length % templates.length];
  
  // Ensure descriptions are naturally under 90 characters
  let headline = smartTruncate(template.headline, 40);
  let description = smartTruncate(template.description, 90);
  
  return {
    headline,
    description,
    source: "mock"
  };
}