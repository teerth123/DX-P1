import { NextResponse } from "next/server";
import { generateGeminiContent } from "@/lib/gemini";

export async function POST(req: Request) {
  const { prompt, words } = await req.json();
  const text = await generateGeminiContent(prompt, words);
  return NextResponse.json({ text });
}
