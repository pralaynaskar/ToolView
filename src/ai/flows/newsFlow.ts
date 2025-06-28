'use server';
/**
 * @fileOverview A flow to generate a set of news articles with summaries and images.
 *
 * - getNewsArticles - A function that returns a list of generated news articles.
 * - NewsArticle - The type for a single news article.
 */

import { ai } from '@/ai/genkit';
import { generateImage } from '@/ai/flows/generateImageFlow';
import { z } from 'zod';

const ArticleSchema = z.object({
  headline: z.string().describe('A compelling and realistic news headline.'),
  category: z.string().describe('The category of the news article (e.g., Technology, World News, Science, Business).'),
  summary: z.string().describe('A one-paragraph summary of the news article.'),
  imagePrompt: z.string().describe('A simple, two-word prompt for an AI image generator that captures the essence of the article (e.g., "rocket launch", "stock market").'),
});

const NewsFeedSchema = z.object({
  articles: z.array(ArticleSchema).describe('A list of 5 diverse and interesting news articles.'),
});

// We'll add the imageUrl to the article object after generation.
export type NewsArticle = z.infer<typeof ArticleSchema> & { imageUrl: string };

export async function getNewsArticles(): Promise<NewsArticle[]> {
    const generatedData = await newsGenerationFlow();

    if (!generatedData || !generatedData.articles) {
        throw new Error("Failed to generate news articles.");
    }
    
    // Generate images for each article in parallel
    const articlesWithImages = await Promise.all(
        generatedData.articles.map(async (article) => {
            try {
                const imageUrl = await generateImage(article.imagePrompt);
                return { ...article, imageUrl };
            } catch (error) {
                console.error(`Failed to generate image for: ${article.headline}`, error);
                // Provide a fallback image
                return { ...article, imageUrl: 'https://placehold.co/600x400.png' };
            }
        })
    );

    return articlesWithImages;
}

const newsGenerationFlow = ai.defineFlow(
  {
    name: 'newsGenerationFlow',
    inputSchema: z.void(),
    outputSchema: NewsFeedSchema,
  },
  async () => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: `Generate a list of 5 diverse and interesting news articles. The articles should cover a range of topics like technology, world news, science, and business. For each article, provide a compelling headline, a category, a one-paragraph summary, and a simple two-word prompt for an AI image generator that visually represents the story.`,
      output: {
        schema: NewsFeedSchema,
      },
      config: {
          temperature: 0.8, // Add some creativity to the news
      }
    });

    return llmResponse.output!;
  }
);
