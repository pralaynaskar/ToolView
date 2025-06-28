
'use server';
/**
 * @fileOverview An AI chat flow that can optionally handle image input.
 *
 * - askAI - A function that handles the AI chat interaction.
 * - AiChatInput - The input type for the askAI function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const AiChatInputSchema = z.object({
  prompt: z.string().describe('The user text prompt.'),
  image: z
    .string()
    .optional()
    .describe(
      "An optional image provided by the user, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'. This is only supported by vision-enabled models."
    ),
  model: z.string().optional().describe('The full AI model identifier (e.g., `googleai/gemini-2.0-flash` or `openai/gpt-4o`).'),
});
export type AiChatInput = z.infer<typeof AiChatInputSchema>;

export async function askAI(input: AiChatInput): Promise<string> {
  const result = await aiChatFlow(input);
  return result;
}

const aiChatFlow = ai.defineFlow(
  {
    name: 'aiChatFlow',
    inputSchema: AiChatInputSchema,
    outputSchema: z.string(),
  },
  async (input) => {
    // Construct the prompt for the model
    const promptParts: (string | { text: string; } | { media: { url: string; }; })[] = [];
    
    if (input.prompt) {
        promptParts.push({ text: input.prompt });
    } else {
        // Gemini requires a text part, even if it's empty, when an image is present.
        promptParts.push({ text: "Describe this image." });
    }

    if (input.image) {
      promptParts.push({ media: { url: input.image } });
    }

    const llmResponse = await ai.generate({
      prompt: promptParts,
      model: input.model || 'googleai/gemini-2.0-flash',
    });

    return llmResponse.text;
  }
);

export async function getApiKeyStatus() {
  return {
    openai: !!process.env.OPENAI_API_KEY,
    openweather: !!process.env.NEXT_PUBLIC_OPENWEATHER_API_KEY,
    accuweather: !!process.env.NEXT_PUBLIC_ACCUWEATHER_API_KEY,
  };
}
