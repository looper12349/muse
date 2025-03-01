// lib/aceternity-ui/card-hover.jsx
"use client";
import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import { cn } from "./utils";

export const HoverCard = ({ 
  children, 
  className,
  content,
  imageUrl,
  title,
  subtitle
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const cardRef = useRef(null);

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    setMousePosition({ x, y });
  };

  return (
    <motion.div
      ref={cardRef}
      className={cn(
        "relative overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-b from-gray-900 to-gray-950",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{
        transformStyle: "preserve-3d",
      }}
      animate={{
        rotateX: isHovered ? -5 : 0,
        rotateY: isHovered ? 5 : 0,
        transform: isHovered ? "perspective(1000px)" : "perspective(0px)",
      }}
      transition={{ duration: 0.2 }}
    >
      <motion.div
        style={{
          background: isHovered 
            ? `radial-gradient(circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(30, 64, 175, 0.15), transparent 80%)`
            : "none",
        }}
        className="absolute inset-0 z-10 transition-opacity duration-500"
      />
      
      {imageUrl && (
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div className="absolute inset-0 z-0 bg-gradient-to-b from-transparent via-transparent to-gray-950" />
          <img
            src={imageUrl}
            alt={title || "Card background"}
            className="h-full w-full object-cover"
          />
        </div>
      )}
      
      <div className="relative z-20 p-6 h-full flex flex-col">
        {title && <h3 className="text-xl font-bold text-white mb-1">{title}</h3>}
        {subtitle && <p className="text-sm text-gray-400 mb-4">{subtitle}</p>}
        {content && <div className="text-gray-300">{content}</div>}
        {children}
      </div>
      
      <motion.div
        className="absolute inset-0 z-10 border border-blue-500 rounded-xl opacity-0"
        animate={{
          opacity: isHovered ? 1 : 0,
        }}
        transition={{
          duration: 0.4,
        }}
      />
    </motion.div>
  );
};