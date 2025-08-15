import { NextRequest, NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

interface SupplierGenerationRequest {
  product: string;
}

interface Supplier {
  name: string;
  productCount: number;
  rating: number;
  location: string;
  shippingDays: string;
  minOrder: string;
  borderColor: string;
  textColor: string;
}

export async function POST(request: NextRequest) {
  try {
    const body: SupplierGenerationRequest = await request.json();

    if (!body.product) {
      return NextResponse.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      console.warn("GEMINI_API_KEY not found, using mock suppliers");

      // Fallback to mock data if no API key
      const mockSuppliers = generateMockSuppliers(body.product);
      await new Promise((resolve) => setTimeout(resolve, 1500)); // Simulate API delay

      return NextResponse.json({ suppliers: mockSuppliers });
    }

    try {
      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash-exp" });

      const prompt = `Generate 3 realistic suppliers for "${body.product}". Make them relevant to the product category.

      Respond with ONLY a JSON object in this exact format:
      {
        "suppliers": [
          {
            "name": "Company Name Ltd",
            "location": "City, Country",
            "productCount": 1500,
            "rating": 4.6,
            "shippingDays": "5-10 days",
            "minOrder": "$50"
          }
        ]
      }

      Make company names realistic and locations appropriate for the product type. Vary the product counts (500-3000), ratings (4.2-4.9), shipping times (3-14 days), and minimum orders ($25-$150).`;

      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();

      // Parse the JSON response
      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error("Invalid JSON response from AI");
      }

      const aiResponse = JSON.parse(jsonMatch[0]);

      if (
        !aiResponse.suppliers ||
        !Array.isArray(aiResponse.suppliers) ||
        aiResponse.suppliers.length !== 3
      ) {
        throw new Error("AI response missing or invalid suppliers array");
      }

      // Add colors and format the suppliers
      const colors = [
        { borderColor: "border-blue-200", textColor: "text-blue-700" },
        { borderColor: "border-green-200", textColor: "text-green-700" },
        { borderColor: "border-purple-200", textColor: "text-purple-700" },
      ];

      const formattedSuppliers = aiResponse.suppliers.map(
        (supplier: any, index: number) => ({
          name: supplier.name || "Unknown Supplier",
          productCount: Number(supplier.productCount) || 1000,
          rating: Number(supplier.rating) || 4.5,
          location: supplier.location || "Global",
          shippingDays: supplier.shippingDays || "5-10 days",
          minOrder: supplier.minOrder || "$50",
          borderColor: colors[index].borderColor,
          textColor: colors[index].textColor,
        })
      );

      console.log("Gemini AI Suppliers Generated:", {
        product: body.product,
        suppliersCount: formattedSuppliers.length,
      });

      return NextResponse.json({
        suppliers: formattedSuppliers,
        source: "gemini-ai",
      });
    } catch (aiError) {
      console.error("Gemini AI error:", aiError);

      // Fallback to mock data if AI fails
      const mockSuppliers = generateMockSuppliers(body.product);
      return NextResponse.json({
        suppliers: mockSuppliers,
        source: "mock-fallback",
        note: "AI service unavailable, using generated content",
      });
    }
  } catch (error) {
    console.error("Error in supplier generation endpoint:", error);

    return NextResponse.json(
      { error: "Failed to generate suppliers. Please try again." },
      { status: 500 }
    );
  }
}

function generateMockSuppliers(product: string): Supplier[] {
  const productLower = product.toLowerCase();

  // Categorize the product
  let category = "general";
  if (
    productLower.includes("electronics") ||
    productLower.includes("phone") ||
    productLower.includes("laptop") ||
    productLower.includes("tech")
  ) {
    category = "electronics";
  } else if (
    productLower.includes("clothing") ||
    productLower.includes("fashion") ||
    productLower.includes("shirt") ||
    productLower.includes("dress")
  ) {
    category = "fashion";
  } else if (
    productLower.includes("home") ||
    productLower.includes("kitchen") ||
    productLower.includes("furniture") ||
    productLower.includes("cup") ||
    productLower.includes("bottle")
  ) {
    category = "home";
  } else if (
    productLower.includes("beauty") ||
    productLower.includes("cosmetic") ||
    productLower.includes("skincare")
  ) {
    category = "beauty";
  } else if (
    productLower.includes("toy") ||
    productLower.includes("game") ||
    productLower.includes("kids")
  ) {
    category = "toys";
  }

  const supplierTemplates = {
    electronics: [
      { base: "TechSource Global", location: "Shenzhen, China" },
      { base: "ElectroMax Industries", location: "Taipei, Taiwan" },
      { base: "Digital Dynamics Ltd", location: "Seoul, South Korea" },
    ],
    fashion: [
      { base: "Fashion Forward Co", location: "Milan, Italy" },
      { base: "Textile Masters", location: "Mumbai, India" },
      { base: "Style Solutions", location: "Istanbul, Turkey" },
    ],
    home: [
      { base: "Home Essentials Ltd", location: "Guangzhou, China" },
      { base: "Living Space Co", location: "Ho Chi Minh, Vietnam" },
      { base: "Quality Home Goods", location: "Bangkok, Thailand" },
    ],
    beauty: [
      { base: "Beauty Innovations", location: "Paris, France" },
      { base: "Glow Products Inc", location: "Seoul, South Korea" },
      { base: "Natural Beauty Co", location: "Los Angeles, USA" },
    ],
    toys: [
      { base: "PlayTime Manufacturing", location: "Dongguan, China" },
      { base: "Fun Factory Ltd", location: "Hamburg, Germany" },
      { base: "KidJoy Products", location: "Osaka, Japan" },
    ],
    general: [
      { base: "Global Trade Partners", location: "Hong Kong" },
      { base: "Universal Suppliers", location: "Singapore" },
      { base: "Premier Products Co", location: "Dubai, UAE" },
    ],
  };

  const templates =
    supplierTemplates[category as keyof typeof supplierTemplates] ||
    supplierTemplates.general;
  const colors = [
    { borderColor: "border-blue-200", textColor: "text-blue-700" },
    { borderColor: "border-green-200", textColor: "text-green-700" },
    { borderColor: "border-purple-200", textColor: "text-purple-700" },
  ];

  return templates.map((template, index) => ({
    name: template.base,
    productCount: Math.floor(Math.random() * 2500) + 500,
    rating: Number((4.2 + Math.random() * 0.7).toFixed(1)),
    location: template.location,
    shippingDays: `${3 + Math.floor(Math.random() * 8)}-${
      7 + Math.floor(Math.random() * 12)
    } days`,
    minOrder: `$${[25, 50, 100, 150][Math.floor(Math.random() * 4)]}`,
    borderColor: colors[index].borderColor,
    textColor: colors[index].textColor,
  }));
}
