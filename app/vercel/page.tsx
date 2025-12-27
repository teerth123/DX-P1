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

  const text = `Oops — looks like the Gemini API has hit its daily limit.
So instead of AI-generated text, here’s a quick about me for now.

I’m Teerth Kulkarni[https://www.linkedin.com/in/teerth-kulkarni-152334290/], a final-year engineering student from WCE Sangli[https://walchandsangli.ac.in/]. I’ve always been inclined toward creative work — drawing, designing interfaces, editing videos, and experimenting with visual ideas. Over time, that interest naturally translated into building things on the web, where design meets engineering. You can see most of my visual experiments and UI explorations on DexT[https://www.dexteerth.me/], which acts as my personal playground on the internet.

Yeah… I already have quite a few projects, but now I’m intentionally building a series of design-specific projects, where visual clarity, interaction, and execution quality matter more than raw functionality. This project is the first in that track. The idea is to slow down, care deeply about details, and sharpen my design instincts while still keeping things technically sound.

That said, my background isn’t limited to design. I also work on backend systems and full-stack applications, and I enjoy understanding products end-to-end — from APIs and data flow to deployment. Some of my full-stack and backend work lives on my GitHub[https://github.com/teerth123]. Earlier in my journey (and not part of this design-heavy track), I built a website as part of a giveaway by Striver, inspired by the TUFF (takeUforward) ecosystem — you can see the demo here[https://x.com/DexTee_17/status/1942136333423477105] and the live version here[https://tufff.netlify.app/]. Along the way, I’ve also had a few small but meaningful wins: receiving a 1 lakh INR government grant[https://www.linkedin.com/feed/update/urn:li:activity:7404567633020530688/] for this project, making an open-source contribution here[https://github.com/dodopayments/billingsdk/pull/161], and getting noticed by Klavis AI[https://www.klavis.ai/] (a YC-backed startup) after I redesigned their hero section — the redesign post is here[https://x.com/Klavis_AI/status/1960771091179413561] and the live version here[https://klavisaihero.netlify.app/].

Currently, I’m working at AT20.ai[https://www.at20.ai/], where I got placed on-campus, and I’m grateful to Kirat[https://x.com/kirat_tw] for the guidance and learning resources that helped me stay consistent. I share my journey, experiments, and small wins on Twitter[https://x.com/DexTee_17]. I’m not a 100x developer yet — I’m still learning, failing, and improving. Thanks for stopping by!`;
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
                  placeholder="enter any topic"
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
                  isDummyText={blog.Desc === text}
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
