"use client"

import {
  motion,
  number,
  Variants,
  useMotionValue,
  useSpring,
} from "motion/react";
import { useRef } from "react";

interface CardProps {
  text: string;
  className?: string;
  onClick?: () => void;
  onHover?: () => void;
}

export default function MagneticButtons({ text, className, onClick, onHover }: CardProps) {
  const firstRef = useRef<HTMLDivElement | null>(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  function mouseTracker(e: any) {
    if (!firstRef.current) return;
    const { left, top, width, height } =
      firstRef.current.getBoundingClientRect();
    e.preventDefault();
    console.log(e.clientX, e.clientY);
    const relativeX = e.clientX - left;
    const relativeY = e.clientY - top;
    x.set((relativeX - width / 2) * 0.2);
    y.set((relativeY - height / 2) * 0.2);
  }
  function mouseLeave(e: any) {
    x.set(0);
    y.set(0);
  }

  return (
    <>
      <motion.div
        className="cursor-default p-5 rounded-lg text-center"
        onMouseMove={mouseTracker}
        onMouseLeave={mouseLeave}
        onClick={onClick}
        ref={firstRef}
        style={{ x: x, y: y }}
        transition={{ease:"easeInOut"}}
      >
        <h1 className={`border border-[#e0e0e0] dark:border-[#333] bg-white dark:bg-[#0a0a0a] p-2 rounded-lg text-[#171717] dark:text-[#ededed] ${className || ''}`}>
          {text}
        </h1>
      </motion.div>
    </>
  );
}
