'use server';
/**
 * @fileOverview An AI flow to generate an image based on a text prompt.
 *
 * - generateImage - A function that handles image generation.
 * - GenerateImageInput - The input type for the generateImage function.
 */
import { ai } from '@/ai/genkit';
import { z } from 'zod';

const GenerateImageInputSchema = z.string().describe('A text prompt to generate an image from.');
export type GenerateImageInput = z.infer<typeof GenerateImageInputSchema>;

export async function generateImage(input: GenerateImageInput): Promise<string> {
  const result = await generateImageFlow(input);
  return result;
}

const generateImageFlow = ai.defineFlow(
  {
    name: 'generateImageFlow',
    inputSchema: GenerateImageInputSchema,
    outputSchema: z.string(),
  },
  async (prompt) => {
    const { media } = await ai.generate({
      model: 'googleai/gemini-2.0-flash-preview-image-generation',
      prompt: `Generate an abstract, artistic, vibrant album cover based on the theme: ${prompt}`,
      config: {
        responseModalities: ['TEXT', 'IMAGE'],
      },
    });

    if (!media) {
      throw new Error('Image generation failed to return media.');
    }

    return media.url;
  }
);
