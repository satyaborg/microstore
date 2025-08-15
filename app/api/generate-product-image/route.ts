import { openai } from "@ai-sdk/openai";
import { experimental_generateImage } from "ai";

export async function POST(req: Request) {
  try {
    const {
      productName,
      productDescription,
      category,
    }: {
      productName: string;
      productDescription: string;
      category?: string;
    } = await req.json();

    if (!productName) {
      return Response.json(
        { error: "Product name is required" },
        { status: 400 }
      );
    }

    // Create a detailed prompt for image generation optimized for e-commerce thumbnails
    const prompt = `Professional e-commerce product photography of ${productName}. ${
      productDescription || ""
    } ${
      category ? `${category} product.` : ""
    } Clean pure white background, centered composition, studio lighting with soft shadows, commercial quality, high-resolution, crisp details. Shot with professional camera, perfect for online store thumbnail. Product should be the main focus, well-lit from multiple angles, no distracting elements. Commercial advertising style, marketplace ready, conversion-optimized product image.`;

    const { image } = await experimental_generateImage({
      model: openai.image("gpt-image-1"),
      prompt: prompt,
      size: "512x512",
    });

    return Response.json({
      base64: image.base64,
      uint8Array: image.uint8Array,
      mediaType: image.mediaType,
    });
  } catch (error) {
    console.error("Error generating product image:", error);
    return Response.json(
      { error: "Failed to generate image" },
      { status: 500 }
    );
  }
}
