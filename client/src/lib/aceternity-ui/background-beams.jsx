// lib/aceternity-ui/background-beams.jsx
"use client";
import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";

export const BackgroundBeams = ({ children, className }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const ref = useRef(null);

  useEffect(() => {
    const updateMousePosition = (ev) => {
      if (!ref.current) return;
      const { clientX, clientY } = ev;
      const { left, top, width, height } = ref.current.getBoundingClientRect();
      const x = (clientX - left) / width;
      const y = (clientY - top) / height;
      setMousePosition({ x, y });
    };

    window.addEventListener("mousemove", updateMousePosition);

    return () => {
      window.removeEventListener("mousemove", updateMousePosition);
    };
  }, []);

  return (
    <motion.div
      ref={ref}
      className={`relative overflow-hidden ${className}`}
      style={{
        background: `radial-gradient(circle at ${mousePosition.x * 100}% ${
          mousePosition.y * 100
        }%, rgb(14, 165, 233), rgb(3, 105, 161), rgb(12, 32, 65), rgb(12, 32, 65))`,
      }}
    >
      <div className="absolute inset-0 w-full h-full bg-gradient-to-tr from-gray-950 via-transparent to-transparent opacity-70"></div>

      <svg className="absolute inset-0 z-0 opacity-30" width="100%" height="100%">
        <defs>
          <pattern
            id="beams"
            patternUnits="userSpaceOnUse"
            width="20"
            height="20"
            patternTransform="scale(5) rotate(0)"
          >
            <path
              d="M 10,-2.55e-7 V 20 Z M -1.1677362e-8,10 H 20 Z"
              strokeWidth="0.5"
              stroke="hsl(210, 100%, 80%)"
              fill="none"
            />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#beams)" />
      </svg>

      {children}
    </motion.div>
  );
};
