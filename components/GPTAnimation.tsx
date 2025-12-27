"use client";
import { motion, Variants } from "motion/react";
import { useEffect, useState } from "react";

const container: Variants = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.03,
    },
  },
};

const wordVariant: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.15, ease: [0.25, 1, 0.5, 1] },
  },
};

interface GPTAnimationProps {
  Title: string;
  Desc: string;
  onWordClick: (word: string, url?: string) => void;
}

function parseTextWithLinks(text: string) {
  const regex = /([^\s\[]+)\[(https?:\/\/[^\]]+)\]/g;
  const parts: Array<{ text: string; url?: string }> = [];
  let lastIndex = 0;
  let match;

  console.log("Parsing text for links:", text.substring(0, 200));

  while ((match = regex.exec(text)) !== null) {
    console.log("Found link match:", match[1], match[2]);
    // Add text before the link
    if (match.index > lastIndex) {
      const beforeText = text.substring(lastIndex, match.index);
      beforeText.split(" ").forEach((word) => {
        if (word) parts.push({ text: word });
      });
    }

    // Add the link
    parts.push({ text: match[1], url: match[2] });

    lastIndex = regex.lastIndex;
  }

  // Add remaining text after last link
  if (lastIndex < text.length) {
    const remainingText = text.substring(lastIndex);
    remainingText.split(" ").forEach((word) => {
      if (word) parts.push({ text: word });
    });
  }

  console.log("Parsed parts:", parts);
  return parts;
}

export default function GPTAnimation({
  Title,
  Desc,
  onWordClick,
}: GPTAnimationProps) {
  // Check if content is loading
  const isLoading = Desc === "LOADING";
  const parts = isLoading ? [] : parseTextWithLinks(Desc);

  return (
    <>
      <div className="font-lg font-semibold flex justify-center fixed-top">
        <h1 className="my-5 font-sans text-3xl font-semibold  tracking-[-0.04em] text-balance">
          {Title}
        </h1>
      </div>
      <div className="flex flex-col">
        {isLoading ? (
          <div className="flex justify-center items-center min-h-[200px]">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#0072F5] dark:border-[#52A8FF]"></div>
          </div>
        ) : (
          <motion.div
            initial="hidden"
            animate="show"
            variants={container}
            className="text-justify user-select-none"
          >
          {parts.map((part, i) => (
            <motion.span
              key={i}
              variants={wordVariant}
              className={`inline text-[var(--accents-5)] tracking-[var(--letter-spacing-1)] bg-[var(--geist-background)] w-[calc(100%-var(--line-width)*2)] left-[var(--line-width)] py-6 text-[max(15px,min(2vw,20px))] font-normal leading-[1.6] ${
                part.url ? "cursor-pointer pointer-events-auto" : ""
              }`}
              style={part.url ? { pointerEvents: "auto" } : undefined}
            >
              {part.url ? (
                <button
                  type="button"
                  className="bg-none border-none padding-0 underline hover:opacity-70 active:opacity-70 transition-opacity text-[#0072F5] dark:text-[#52A8FF] select-none cursor-pointer p-0 m-0 font-inherit"
                  onClick={(e) => {
                    e.preventDefault();
                    console.log("Hyperlink clicked:", { text: part.text, url: part.url });
                    onWordClick(part.text, part.url);
                  }}
                  onTouchEnd={(e) => {
                    e.preventDefault();
                    console.log("Hyperlink touched:", { text: part.text, url: part.url });
                    onWordClick(part.text, part.url);
                  }}
                >
                  {part.text}
                </button>
              ) : (
                part.text
              )}
              {i !== parts.length - 1 ? " " : ""}
            </motion.span>
          ))}
          </motion.div>
        )}
      </div>
    </>
  );
}
