"use server";

import { generateGeminiContent } from "@/lib/gemini";

export async function generateArticle(prompt: string, words: number) {
  return await generateGeminiContent(prompt, words);
}
