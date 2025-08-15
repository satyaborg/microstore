import { openai } from "@ai-sdk/openai";
import { generateObject } from "ai";
import { z } from "zod";

const result = await generateObject({
  model: openai("gpt-4.1-mini"),
  providerOptions: {
    openai: {
      structuredOutputs: false,
    },
  },
  schemaName: "recipe",
  schemaDescription: "A recipe for lasagna.",
  schema: z.object({
    name: z.string(),
    ingredients: z.array(
      z.object({
        name: z.string(),
        amount: z.string(),
      })
    ),
    steps: z.array(z.string()),
  }),
  prompt: "Generate a lasagna recipe.",
});

console.log(JSON.stringify(result.object, null, 2));
