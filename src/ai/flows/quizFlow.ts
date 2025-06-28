'use server';
/**
 * @fileOverview A flow to generate a quiz on a given topic.
 *
 * - generateQuiz - A function that returns a list of quiz questions.
 * - QuizInput - The input type for the generateQuiz function.
 * - QuizOutput - The return type for the generateQuiz function.
 */

import { ai } from '@/ai/genkit';
import { z } from 'zod';

const QuestionSchema = z.object({
  question: z.string().describe('The quiz question.'),
  options: z.array(z.string()).length(4).describe('An array of 4 possible answers.'),
  correctAnswer: z.string().describe('The correct answer from the options array.'),
});

const QuizInputSchema = z.object({
  topic: z.string().describe('The topic for the quiz. If "Random", choose a popular, general knowledge topic.'),
});
export type QuizInput = z.infer<typeof QuizInputSchema>;

const QuizOutputSchema = z.object({
  questions: z.array(QuestionSchema).length(10).describe('A list of 10 quiz questions.'),
});
export type QuizOutput = z.infer<typeof QuizOutputSchema>;


export async function generateQuiz(input: QuizInput): Promise<QuizOutput> {
  return quizGenerationFlow(input);
}

const quizGenerationFlow = ai.defineFlow(
  {
    name: 'quizGenerationFlow',
    inputSchema: QuizInputSchema,
    outputSchema: QuizOutputSchema,
  },
  async ({ topic }) => {
    const llmResponse = await ai.generate({
      model: 'googleai/gemini-2.0-flash',
      prompt: `Generate a fun and challenging quiz with 10 multiple-choice questions about the topic: ${topic}. Each question should have 4 options, and you must clearly indicate the correct answer. Ensure the questions cover a good range of difficulty within the topic. If the topic is "Random", please pick a well-known topic like 'World Capitals' or 'Famous Inventions'.`,
      output: {
        schema: QuizOutputSchema,
      },
      config: {
        temperature: 0.7,
      },
    });

    return llmResponse.output!;
  }
);
