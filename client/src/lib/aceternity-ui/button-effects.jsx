// lib/aceternity-ui/button-effects.jsx
"use client";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { cn } from "./utils";

export const PulseButton = ({ 
  children, 
  onClick, 
  className,
  color = "#3b82f6", 
  size = 5
}) => {
  const [isPulsing, setIsPulsing] = useState(false);
  
  const handleClick = (e) => {
    setIsPulsing(true);
    
    if (onClick) {
      onClick(e);
    }
    
    setTimeout(() => setIsPulsing(false), 1000);
  };
  
  return (
    <div className="relative">
      {isPulsing && (
        <motion.div
          initial={{ opacity: 0.5, scale: 1 }}
          animate={{ opacity: 0, scale: 1.5 }}
          transition={{ duration: 1 }}
          className="absolute inset-0 rounded-full"
          style={{ backgroundColor: color }}
        />
      )}
      <button
        onClick={handleClick}
        className={cn("relative z-10", className)}
      >
        {children}
      </button>
    </div>
  );
};

export const GlowButton = ({ 
  children, 
  onClick, 
  className,
  glowColor = "rgba(59, 130, 246, 0.5)" 
}) => {
  const [isHovered, setIsHovered] = useState(false);
  
  return (
    <motion.button
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      className={cn("relative rounded-lg overflow-hidden", className)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <motion.div 
        className="absolute inset-0 z-0"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        style={{ 
          boxShadow: `0 0 20px 5px ${glowColor}`,
          background: `radial-gradient(circle, ${glowColor} 0%, rgba(0,0,0,0) 70%)` 
        }}
      />
      <div className="relative z-10">{children}</div>
    </motion.button>
  );
};

export const RippleButton = ({ 
  children, 
  onClick, 
  className,
  rippleColor = "rgba(255, 255, 255, 0.3)" 
}) => {
  const [ripples, setRipples] = useState([]);
  
  const handleClick = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const left = e.clientX - rect.left;
    const top = e.clientY - rect.top;
    
    const size = Math.max(rect.width, rect.height) * 2;
    
    const newRipple = {
      id: Date.now(),
      left,
      top,
      size
    };
    
    setRipples([...ripples, newRipple]);
    
    if (onClick) {
      onClick(e);
    }
    
    setTimeout(() => {
      setRipples(ripples => ripples.filter(r => r.id !== newRipple.id));
    }, 1000);
  };
  
  return (
    <button onClick={handleClick} className={cn("relative overflow-hidden", className)}>
      {ripples.map(ripple => (
        <motion.div
          key={ripple.id}
          initial={{ scale: 0, opacity: 0.5 }}
          animate={{ scale: 1, opacity: 0 }}
          transition={{ duration: 1 }}
          className="absolute rounded-full"
          style={{
            backgroundColor: rippleColor,
            left: ripple.left - ripple.size / 2,
            top: ripple.top - ripple.size / 2,
            width: ripple.size,
            height: ripple.size
          }}
        />
      ))}
      <div className="relative z-10">{children}</div>
    </button>
  );
};