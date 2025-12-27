"use client";

import MagneticButtons from "@/components/Magnet";
import React, { useState, useEffect } from "react";
import { Sun, Moon } from "lucide-react";
import { motion, useReducedMotion } from "motion/react";
import GPTAnimation from "@/components/GPTAnimation";
import LLMLoading from "@/components/Loading";
import useSound from "use-sound";
import axios from "axios";
import { generateArticle } from "../server";

export default function VercelPage() {
  const [url, setUrl] = useState<string | null>(null);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [blogs, setBlogs] = useState<Array<{ Title: string; Desc: string }>>(
    []
  );
  const scrollRef = React.useRef<HTMLDivElement>(null);
  const [newWord, setNewWord] = useState<{ text: string; url?: string } | null>(
    null
  );
  const [scrollerNum, setScrollerNum] = useState<number>(0);
  const audioRef = React.useRef<HTMLAudioElement | null>(null);
  const [llmResp, setLLMResp] = useState<string>("");

  useEffect(() => {
    audioRef.current = new Audio("/mouse.mp3");
    audioRef.current.volume = 0.5;
  }, []);

  const playSound = () => {
    if (!audioRef.current) return;
    audioRef.current.currentTime = 0;
    audioRef.current.play().catch(() => {});
  };

  useEffect(() => {
    document.documentElement.classList.add("dark");
  }, []);

  const toggleTheme = () => {
    setIsDarkMode(!isDarkMode);
    document.documentElement.classList.toggle("dark");
  };

  useEffect(() => {
    if (newWord) {
      console.log("Clicked word:", newWord.text, "URL:", newWord.url);
      playSound();

      const blogIndex = blogs.length;
      setBlogs((prev) => [...prev, { Title: newWord.text, Desc: "LOADING" }]);

      fetchContent(newWord.text, newWord.url, blogIndex);
    }
  }, [newWord]);

  const fetchContent = async (
    topic: string,
    url: string | undefined,
    index: number
  ) => {
    try {
      const prompt = url
        ? `Write about ${topic}. Context: This relates to ${url}. When mentioning related topics, format hyperlinks as: word[http://example.com]`
        : `Write about ${topic}. When mentioning related topics or sources, format any hyperlinks as: word[http://example.com]`;

      console.log("Fetching content with:", { topic, url, prompt });

      const res = await axios.post("/api/generate", { prompt, words: 350 });
      console.log("API Response:", res.data.text.substring(0, 200));
      setBlogs((prev) => {
        const updated = [...prev];
        updated[index] = { Title: topic, Desc: res.data.text };
        return updated;
      });
    } catch (e) {
      console.log(e);
      setTimeout(() => {
        setBlogs((prev) => {
          const updated = [...prev];
          updated[index] = {
            Title: topic,
            Desc: text,
          };
          return updated;
        });
      }, 3500);
    }
  };

  useEffect(() => {
    if (!scrollRef.current) return;

    scrollRef.current.scrollTo({
      left: scrollRef.current.scrollWidth,
      behavior: "smooth",
    });

    console.log(scrollRef.current.scrollWidth);
    console.log(scrollRef.current.scrollLeft);
  }, [blogs.length]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const onScroll = () => {
      const page = Math.min(
        blogs.length,
        Math.floor(el.scrollLeft / el.clientWidth)
      );
      setScrollerNum(page);
    };

    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [blogs.length]);

  const text = `Modern web development often involves blending clear communication with subtle interaction design, and hyperlinks play a major role in that experience. When creating personal portfolios, developers often reference their best work using simple inline markers like project names paired with URLs, such as portfolio[https://dexteerth.me] or github[https://github.com]. This lightweight syntax keeps the text readable while still embedding meaningful links that can later be parsed into proper clickable elements. Teams working on collaborative projects frequently document tools and resources using similar patterns. For example, a backend engineer might reference api-docs[https://api.example.com/docs], while a designer could point to their figma-file[https://figma.com/example] to illustrate layout intentions. These link markers help maintain flow in long paragraphs without breaking the reader’s attention. Educational content also benefits from this format. A tutorial might say: “If you're learning React, start with react-docs[https://react.dev] before jumping into advanced libraries like framer-motion[https://www.framer.com/motion].” This keeps the narrative clean while still offering paths for deeper exploration. Even teams writing internal notes or engineering logs can adopt this pattern to keep discussions focused. Statements like “Our deployment pipeline relies on workflow-config[https://ci.example.com/config]” or “Refer to monitoring-dashboard[https://status.example.com] for live system metrics” remain readable without cluttering the text with long raw URLs. Using inline hyperlink syntax is especially useful when the final rendering layer automatically transforms these markers into styled anchor components, improving usability while preserving a clean writing format. Modern web development often involves blending clear communication with subtle interaction design, and hyperlinks play a major role in that experience. When creating personal portfolios, developers often reference their best work using simple inline markers like project names paired with URLs, such as portfolio[https://dexteerth.me] or github[https://github.com]. This lightweight syntax keeps the text readable while still embedding meaningful links that can later be parsed into proper clickable elements. Teams working on collaborative projects frequently document tools and best work using simple inline markers like project names paired with URLs, such as portfolio or github . This lightweight syntax keeps the text readable while still embedding meaningful links that can later be parsed into proper clickable elements. Teams working on collaborative projects frequently document tools and`;
  const FormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    playSound();

    const formData = new FormData(e.currentTarget);
    const value = formData.get("link") as string;
    setUrl(value);

    const blogIndex = blogs.length;
    setBlogs((prev) => [...prev, { Title: value, Desc: "LOADING" }]);

    try {
      const res = await axios.post("/api/generate", {
        prompt: value,
        words: 350,
      });
      setBlogs((prev) => {
        const updated = [...prev];
        updated[blogIndex] = { Title: value, Desc: res.data.text };
        return updated;
      });
      console.log(blogs);
    } catch (e) {
      console.log(e);
      setTimeout(() => {
        setBlogs((prev) => {
          const updated = [...prev];
          updated[blogIndex] = {
            Title: value,
            Desc: text,
          };
          return updated;
        });
      }, 3500);
    }
  };

  return (
    <>
      <div
        ref={scrollRef}
        className="h-screen w-screen flex flex-nowrap overflow-x-auto overflow-y-hidden bg-white dark:bg-black text-[#171717] dark:text-white scrollbar-hide"
      >
        <button
          onClick={toggleTheme}
          className="fixed top-5 right-5 p-3 dark:hover:bg-[#1a1a1a] hover:bg-[#f5f5f5] rounded-lg transition-colors z-50"
        >
          {isDarkMode ? (
            <Sun className="w-6 h-6" />
          ) : (
            <Moon className="w-6 h-6" />
          )}
        </button>
        {blogs.length > 0 && (
          <div className="fixed bottom-10 w-full flex justify-center items-center gap-2">
            {blogs.map((_, index) => (
              <hr
                key={index}
                className={`rotate-90 transition-all ${
                  index === scrollerNum - 1
                    ? "w-7 bg-[#0072F5]"
                    : "w-5 bg-[#52A8FF]"
                }`}
              />
            ))}
          </div>
        )}

        <div className="flex-shrink-0 w-screen h-screen flex justify-center items-center">
          <div className="h-[70vh] w-[60vw] border-r border-l border-[#e0e0e0] dark:border-[#333] flex flex-col  items-center xsm:w-[95vw] sm:w-[95vw] sm:px-5 md:w-[90vw] md:px-5 lg:w-[80vw] lg:px-5 xl:w-[80vw] 2xl:w-[60vw] ">
            <h1 className=" my-5 font-sans text-3xl font-semibold  tracking-[-0.04em] text-balance text-[#0072F5] dark:text-[#52A8FF]">
              <span className="">Project</span> One
            </h1>

            <h1 className="text-center my-5 inline text-[var(--accents-5)] tracking-[var(--letter-spacing-1)] bg-[var(--geist-background)] w-[calc(100%-var(--line-width)*2)] left-[var(--line-width)] text-[max(15px,min(2vw,20px))] font-normal leading-[1.6] ">
              A Design Engineered Platform <br />
              that gives you fixed length text drafts.
            </h1>
            <div className="flex-shrink-0 my-5 flex flex-col justify-center w-fit border border-[#e0e0e0] dark:border-[#333] rounded-lg bg-white dark:bg-black">
              <form onSubmit={FormSubmit} className="flex">
                <input
                  type="text"
                  name="link"
                  autoComplete="off"
                  placeholder="enter wikipedia article link"
                  className="focus:outline-none p-2 bg-transparent placeholder:text-[#a3a3a3] dark:placeholder:text-[#737373]"
                />
                <button type="submit" className="px-3">
                  Go
                </button>
              </form>
              <Card
                Title="Daredevil"
                onClick={() => {
                  setNewWord({ text: "Daredevil" });
                }}
                playSound={playSound}
              />
              <Card
                Title="Computer Science"
                onClick={() => {
                  setNewWord({ text: "Computer Science" });
                }}
                playSound={playSound}
              />
              <Card
                Title="Chess"
                onClick={() => {
                  setNewWord({ text: "Chess" });
                }}
                playSound={playSound}
              />
            </div>

            <div className="hidden sm:flex sm:flex-row sm:justify-center sm:items-center w-full my-5 gap-5">
              <div className="w-fit">
                <div className="border border-[#e0e0e0] dark:border-[#333] bg-[#fafafa] dark:bg-[#171614] rounded-lg">
                  <MagneticButtons
                    text="Type any text"
                    className="shadow-custom m-5 shadow-custom"
                    onClick={playSound}
                  />
                </div>
                <h1 className="my-2 text-base leading-6 text-pretty">
                  Type any text in input form above.
                </h1>
              </div>
              <div className="w-fit">
                <div className="border border-[#e0e0e0] dark:border-[#333] bg-[#fafafa] dark:bg-[#171614] rounded-lg">
                  <MagneticButtons
                    text="Interact with Hyperlinks"
                    className="shadow-custom m-5"
                    onClick={playSound}
                  />
                </div>
                <h1 className="my-2 text-base leading-6 text-pretty">
                  Interact with hyperlinks inside content
                </h1>
              </div>
              <div className="w-fit">
                <div className="border border-[#e0e0e0] dark:border-[#333] bg-[#fafafa] dark:bg-[#171614] rounded-lg">
                  <MagneticButtons
                    text="Scroll or Drag"
                    className="shadow-custom m-5"
                    onClick={playSound}
                  />
                </div>
                <h1 className="my-2 text-base leading-6 text-pretty">
                  Scroll or drag to navigate horizontally
                </h1>
              </div>
            </div>
            <div className="flex justify-center items-center gap-5">
              <img
                src="pfp.jpeg"
                alt=""
                className="h-10 w-10 rounded-full object-cover object-[50%_30%]"
              />
              <h1 className="cursor-pointer hover:underline underline-offset-2">
                By{" "}
                <a
                  className="font-semibold font-sans text-[#0072F5] dark:text-[#52A8FF]"
                  href="http://dexTeerth.me"
                  target="_blank"
                >
                  DexT
                </a>
              </h1>
            </div>
          </div>
        </div>
        {blogs.map((blog, index) => (
          <div
            key={index}
            className="flex-shrink-0 w-screen h-screen flex justify-center items-center "
          >
            <motion.div className="h-[70vh] w-[90vw] sm:w-[90vw] md:w-[80vw] border-r border-l border-[#e0e0e0] dark:border-[#333] p-5 overflow-y-auto scrollbar-hide flex flex-col">
              {blog.Desc === "LOADING" ? (
                <>
                  <div className="font-lg font-semibold flex justify-center">
                    <h1 className="my-5 font-sans text-3xl font-semibold tracking-[-0.04em] text-balance">
                      {blog.Title}
                    </h1>
                  </div>
                  <div className="flex-1 flex justify-center items-center">
                    <LLMLoading text={blog.Title} />
                  </div>
                </>
              ) : (
                <GPTAnimation
                  Title={blog.Title}
                  Desc={blog.Desc}
                  onWordClick={(word, url) => setNewWord({ text: word, url })}
                />
              )}
            </motion.div>
          </div>
        ))}
      </div>
    </>
  );
}

function Card({
  Title,
  onClick,
  playSound,
}: {
  Title: string;
  onClick: () => void;
  playSound: () => void;
}) {
  return (
    <div
      onClick={() => {
        playSound();
        onClick();
      }}
      onMouseEnter={playSound}
      className="group cursor-pointer text-[#555] dark:text-[#555]
                 hover:bg-[#f5f5f5] dark:hover:bg-[#151515]
                 hover:text-[#171717] dark:hover:text-[#c2c2c2]"
    >
      <hr className="border-[#e0e0e0] dark:border-[#333]" />
      <div className="w-full p-2 flex justify-between items-center">
        <h1>{Title}</h1>
        <h1 className="opacity-0 group-hover:opacity-100 transition-opacity">
          →
        </h1>
      </div>
    </div>
  );
}
