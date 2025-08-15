import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

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
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `Create an engaging ad copy for "${body.product}". 
      
      Respond with ONLY a JSON object in this exact format:
      {
        "headline": "max 40 characters compelling headline",
        "description": "max 90 characters engaging description highlighting key benefits"
      }
      
      Make it punchy, benefit-focused, and perfect for social media ads.`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from AI");
      }

      const aiResponse = JSON.parse(jsonMatch[0]);
      
      // Validate and truncate if needed
      const headline = aiResponse.headline?.slice(0, 40) || "";
      const description = aiResponse.description?.slice(0, 90) || "";

      if (!headline || !description) {
        throw new Error("AI response missing required fields");
      }

      console.log("Gemini AI Copy Generated:", {
        product: body.product,
        headline,
        description
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
      description: `Premium ${product} with amazing features. Don't miss out on this exclusive offer!`
    },
    {
      headline: `${product} Sale - 50% Off`,
      description: `Top-rated ${product} now available. Free shipping and easy returns guaranteed.`
    },
    {
      headline: `New ${product} Collection`,
      description: `Discover our latest ${product} designs. Perfect quality at unbeatable prices.`
    }
  ];
  
  const template = templates[product.length % templates.length];
  
  return {
    headline: template.headline.slice(0, 40),
    description: template.description.slice(0, 90),
    source: "mock"
  };
}