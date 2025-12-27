"use client"

import { motion } from "framer-motion"
import { useEffect, useState } from "react"

interface LLMLoadingProps {
  text: string
}

export default function LLMLoading({ text }: LLMLoadingProps) {
  const [dots, setDots] = useState("")

  useEffect(() => {
    const interval = setInterval(() => {
      setDots((prev) => (prev.length >= 3 ? "" : prev + "."))
    }, 500)
    return () => clearInterval(interval)
  }, [])

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: { duration: 0.6 },
    },
  }

  const pulseVariants = {
    animate: {
      opacity: [0.8, 0.95, 0.8],
      transition: { duration: 3, repeat: Infinity },
    },
  }

  const floatingVariants = {
    animate: {
      y: [0, -8, 0],
      transition: { duration: 4, repeat: Infinity },
    },
  }

  const glowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(100,181,246,0.25)",
        "0 0 40px rgba(100,181,246,0.45)",
        "0 0 20px rgba(100,181,246,0.25)",
      ],
      transition: { duration: 3, repeat: Infinity },
    },
  }

  const lightGlowVariants = {
    animate: {
      boxShadow: [
        "0 0 20px rgba(59,130,246,0.15)",
        "0 0 40px rgba(59,130,246,0.25)",
        "0 0 20px rgba(59,130,246,0.15)",
      ],
      transition: { duration: 3, repeat: Infinity },
    },
  }

  return (
    <div className="flex justify-center items-center overflow-hidden">
      {/* RELATIVE WRAPPER — THIS FIXES EVERYTHING */}
      <div className="relative w-[420px] h-[280px]">
        {/* GLOW — perfectly aligned */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none dark:block hidden"
          variants={glowVariants}
          animate="animate"
        />

        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none dark:hidden block"
          variants={lightGlowVariants}
          animate="animate"
        />

        {/* CARD */}
        <motion.div
          className="relative w-full h-full rounded-2xl border overflow-hidden shadow-2xl z-10 bg-white dark:bg-black border-[#e0e0e0] dark:border-[#4c4c4c]"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {/* Header */}
          <div className="h-14 flex items-center gap-3 pl-4 border-b bg-[#f5f5f5] dark:bg-[#121212] border-[#e0e0e0] dark:border-[#4c4c4c] rounded-t-2xl">
            <div className="h-3 w-3 rounded-full bg-[#ff5f57]" />
            <div className="h-3 w-3 rounded-full bg-[#febc2e]" />
            <div className="h-3 w-3 rounded-full bg-[#28c940]" />
          </div>

          {/* Grid background */}
          <div
            className="absolute inset-0"
            style={{
              backgroundImage:
                "linear-gradient(rgba(100,181,246,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(100,181,246,0.06) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          <div
            className="absolute inset-0 dark:hidden block"
            style={{
              backgroundImage:
                "linear-gradient(rgba(59,130,246,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,246,0.04) 1px, transparent 1px)",
              backgroundSize: "50px 50px",
            }}
          />

          {/* Center text */}
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <motion.h1
              className="text-4xl font-bold text-center text-[#171717] dark:text-[#e5e7eb]"
              animate={{ opacity: [0.85, 1, 0.85] }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              {text}
            </motion.h1>
          </div>

          {/* Footer */}
          <motion.div
            className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-[#f5f5f5] via-[#f5f5f5]/80 to-transparent dark:from-[#1a1a1a] dark:via-[#1a1a1a]/80 dark:to-transparent px-4 py-4 rounded-b-2xl"
            variants={pulseVariants}
            animate="animate"
          >
            <motion.div variants={floatingVariants} animate="animate">
              <div className="text-xs font-medium flex items-center gap-2 text-[#666] dark:text-[#9f9f9f]">
                <span>Generating{dots}</span>
                <div className="flex gap-1.5">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      className="w-1.5 h-1.5 rounded-full bg-[#3b82f6] dark:bg-[#64b5f6]"
                      animate={{
                        scale: [0.6, 1, 0.6],
                        opacity: [0.4, 1, 0.4],
                      }}
                      transition={{
                        duration: 1.6,
                        repeat: Infinity,
                        delay: i * 0.25,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </div>
  )
}
