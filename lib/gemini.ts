import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GEMINI_API_KEY!);

export const geminiModel = genAI.getGenerativeModel({
  model: "gemini-2.5-flash",
  systemInstruction:`
  I will need detailed yet easy to understand article for a general audience., use simple language and avoid jargon. 
  Include relevant examples to illustrate key points. Ensure the article is engaging and informative, providing value to the reader.
  and include hyperlinks in exactly word[https://example.com] format where appropriate and not like [word](https://example.com). 
  include at least 5-7 hyperlinks in the article.
  Do not decorate text with hash tags and stars. I want plain text with normal special characters only like full stop, commas, exclamation marks etc.`
});

export async function generateGeminiContent(prompt: string, words:number) {
  const result = await geminiModel.generateContent(`give me a detailed article on ${prompt} in approximately ${words} words.`);
  return result.response.text();
}
