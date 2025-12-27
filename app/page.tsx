"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "motion/react";
import { Volume2, Sun, Moon, MessageCirclePlus } from "lucide-react";
import MagneticButtons from "@/components/Magnet";
import GPTAnimation from "@/components/GPTAnimation";

export default function Home() {
  const [url, setUrl] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [blogs, setBlogs] = useState<Array<{ Title: string; Desc: string }>>(
    []
  );
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [newWord, setNewWord] = useState<string | null>(null);

  React.useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    if (newWord) {
      console.log("Clicked word:", newWord);
      setBlogs((prev) => [...prev, { Title: newWord, Desc: text }]);
      console.log(blogs);
    }
  }, [newWord]);

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollWidth,
      behavior: "smooth",
    });
  }, [blogs.length]);

  const text = `Modern web development often involves blending clear communication with subtle interaction design, and hyperlinks play a major role in that experience. When creating personal portfolios, developers often reference their best work using simple inline markers like project names paired with URLs, such as portfolio[https://dexteerth.me] or github[https://github.com]. This lightweight syntax keeps the text readable while still embedding meaningful links that can later be parsed into proper clickable elements. Teams working on collaborative projects frequently document tools and resources using similar patterns. For example, a backend engineer might reference api-docs[https://api.example.com/docs], while a designer could point to their figma-file[https://figma.com/example] to illustrate layout intentions. These link markers help maintain flow in long paragraphs without breaking the reader’s attention. Educational content also benefits from this format. A tutorial might say: “If you're learning React, start with react-docs[https://react.dev] before jumping into advanced libraries like framer-motion[https://www.framer.com/motion].” This keeps the narrative clean while still offering paths for deeper exploration. Even teams writing internal notes or engineering logs can adopt this pattern to keep discussions focused. Statements like “Our deployment pipeline relies on workflow-config[https://ci.example.com/config]” or “Refer to monitoring-dashboard[https://status.example.com] for live system metrics” remain readable without cluttering the text with long raw URLs. Using inline hyperlink syntax is especially useful when the final rendering layer automatically transforms these markers into styled anchor components, improving usability while preserving a clean writing format. Modern web development often involves blending clear communication with subtle interaction design, and hyperlinks play a major role in that experience. When creating personal portfolios, developers often reference their best work using simple inline markers like project names paired with URLs, such as portfolio[https://dexteerth.me] or github[https://github.com]. This lightweight syntax keeps the text readable while still embedding meaningful links that can later be parsed into proper clickable elements. Teams working on collaborative projects frequently document tools and `;
  const FormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const value = formData.get("link") as string;
    setUrl(value);
    // console.log(value);
    // const response = await axios.get(`https://en.wikipedia.org/api/rest_v1/page/summary/${value}`);
    setBlogs((prev) => [...prev, { Title: value, Desc: text }]);
  };

  return (
    <div
      ref={scrollRef}
      className="h-screen w-screen flex flex-nowrap overflow-x-auto overflow-y-hidden bg-white dark:bg-[#0a0a0a] scrollbar-hide"
    >
      <div className="leftSide w-[50vw] flex-shrink-0 h-screen border-r-[#e0e0e0] dark:border-r-[#333] border-r flex flex-col">
        <div className="flex w-full">
          <div className="w-[70%] border border-dashed border-[#e0e0e0] dark:border-[#333]">
            <h1 className="tracking-[-0.05em] p-6 text-[76px] font-semibold text-balance leading-none relative ">
              Project 1One
            </h1>
          </div>
          <div className="w-[30%] border border-dashed border-[#e0e0e0] dark:border-[#333] flex flex-col items-center justify-center gap-4">
            <button className="p-3 dark:hover:bg-[#1a1a1a] hover:bg-[#f5f5f5] rounded-lg transition-colors">
              <Volume2 className="w-6 h-6" />
            </button>
            <button
              onClick={toggleTheme}
              className="p-3 dark:hover:bg-[#1a1a1a] hover:bg-[#f5f5f5] rounded-lg transition-colors"
            >
              {isDarkMode ? (
                <Sun className="w-6 h-6" />
              ) : (
                <Moon className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>

        <div className="w-full bg-diagonal-lines h-[5%] border-dashed border-[#e0e0e0] dark:border-[#333] border"></div>

        <div className="border border-dashed border-[#e0e0e0] dark:border-[#333]">
          <h3 className=" text-[var(--accents-5)] tracking-[var(--letter-spacing-1)] bg-[var(--geist-background)] w-[calc(100%-var(--line-width)*2)] left-[var(--line-width)] py-6 px-8 text-[max(15px,min(2vw,20px))] font-normal leading-[1.6]">
            Summarize Any Article Instantly. <br />
            Turn long web pages, blogs, or Wikipedia articles into clean,
            concise summaries.
          </h3>
        </div>

        <div className="flex-1 border-t border-[#e0e0e0] dark:border-[#333] min-h-0 flex items-center justify-center">
          <div className="grid grid-cols-3 grid-rows-3 w-full aspect-square max-h-full">
            <div className="border border-dashed border-[#e0e0e0] dark:border-[#333] flex justify-center items-center bg-[#fafafa] dark:bg-[#171614]">
              <MagneticButtons text="Paste the URL" className="shadow-custom" />
            </div>
            <div className="border border-dashed border-[#e0e0e0] dark:border-[#333] bg-grid"></div>
            <div className="border border-dashed border-[#e0e0e0] dark:border-[#333] bg-grid"></div>

            <div className="border border-dashed border-[#e0e0e0] dark:border-[#333] bg-grid"></div>
            <div className="border border-dashed border-[#e0e0e0] dark:border-[#333] flex justify-center items-center bg-[#fafafa] dark:bg-[#171614]">
              <MagneticButtons text="Interact with Hyperlinks" className="shadow-custom" />
            </div>
            <div className="border border-dashed border-[#e0e0e0] dark:border-[#333] bg-grid"></div>

            <div className="border border-dashed border-[#e0e0e0] dark:border-[#333] bg-grid"></div>
            <div className="border border-dashed border-[#e0e0e0] dark:border-[#333] bg-grid"></div>
            <div className="border border-dashed border-[#e0e0e0] dark:border-[#333] flex justify-center items-center bg-[#fafafa] dark:bg-[#171614]">
              <MagneticButtons
                text="Scroll or drag horizontally"
                className="shadow-custom"
              />
            </div>
          </div>
        </div>

        <hr className="border-[#e0e0e0] dark:border-[#333]" />

        <div className="flex justify-end m-5">
          <a href="http://dexTeerth.me" target="_blank" className="p-3">
            DexT
          </a>
        </div>
      </div>

      <div className="flex flex-nowrap h-screen">
        {blogs.length === 0 ? (
          <div className="w-[50vw] h-screen flex-shrink-0 flex items-center justify-center">
            <form onSubmit={FormSubmit}>
              <input
                type="text"
                name="link"
                placeholder="enter wikipedia article link"
                className="focus:outline-none"
              />
              <button type="submit">Go</button>
            </form>
          </div>
        ) : (
          blogs.map((blog, index) => (
            <motion.div
              key={index}
              className="w-[50vw] h-screen flex-shrink-0 p-5 overflow-y-auto border-r border-dashed border-[#e0e0e0] dark:border-[#333]"
            >
              <GPTAnimation
                Title={blog.Title}
                Desc={blog.Desc}
                onWordClick={setNewWord}
              />
            </motion.div>
          ))
        )}
      </div>
    </div>
  );
}

