// lib/aceternity-ui/animations.jsx
"use client";
import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "./utils";

export const FadeIn = ({ children, className, delay = 0, duration = 0.5 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const SlideIn = ({ 
  children, 
  className, 
  delay = 0, 
  duration = 0.5, 
  direction = "right"
}) => {
  const directionMap = {
    right: { initial: { x: 100 }, animate: { x: 0 } },
    left: { initial: { x: -100 }, animate: { x: 0 } },
    up: { initial: { y: 100 }, animate: { y: 0 } },
    down: { initial: { y: -100 }, animate: { y: 0 } },
  };
  
  const { initial, animate } = directionMap[direction] || directionMap.right;
  
  return (
    <motion.div
      initial={{ ...initial, opacity: 0 }}
      animate={{ ...animate, opacity: 1 }}
      transition={{ duration, delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
};

export const TypewriterText = ({ text, className, speed = 50 }) => {
  const [displayText, setDisplayText] = useState("");
  const index = useRef(0);
  
  useEffect(() => {
    if (!text) return;
    
    setDisplayText("");
    index.current = 0;
    
    const timer = setInterval(() => {
      if (index.current < text.length) {
        setDisplayText((prev) => prev + text.charAt(index.current));
        index.current += 1;
      } else {
        clearInterval(timer);
      }
    }, speed);
    
    return () => clearInterval(timer);
  }, [text, speed]);
  
  return <span className={className}>{displayText}</span>;
};