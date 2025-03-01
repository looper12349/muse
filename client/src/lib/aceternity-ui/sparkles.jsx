// lib/aceternity-ui/sparkles.jsx
"use client";
import React, { useEffect, useState } from "react";
import { useCanvas } from "./utils";

export const SparklesCore = (props) => {
  const { id, className, background, minSize, maxSize, particleDensity, particleColor, particleSpeed } = props;

  const density = particleDensity || 100;
  const speed = particleSpeed || 1;
  const canvasRef = useCanvas((ctx, canvas) => {
    if (!canvas) return;
    
    let particles = [];
    let width = canvas.width;
    let height = canvas.height;
    
    const getWidth = () => {
      return (
        canvas?.getBoundingClientRect().width || window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth
      );
    };

    const getHeight = () => {
      return (
        canvas?.getBoundingClientRect().height || window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight
      );
    };

    const resize = () => {
      if (!canvas) return;
      width = getWidth();
      height = getHeight();
      canvas.width = width;
      canvas.height = height;

      particles = [];
      for (let i = 0; i < density; i++) {
        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          size: Math.random() * (maxSize || 3) + (minSize || 1),
          color: particleColor || "#FFFFFF",
          speedX: (Math.random() - 0.5) * speed,
          speedY: (Math.random() - 0.5) * speed,
        });
      }
    };

    const draw = () => {
      if (!canvas) return;
      ctx.clearRect(0, 0, width, height);
      
      if (background) {
        ctx.fillStyle = background;
        ctx.fillRect(0, 0, width, height);
      }
      
      particles.forEach((particle, i) => {
        particle.x += particle.speedX;
        particle.y += particle.speedY;
        
        if (particle.x > width) particle.x = 0;
        else if (particle.x < 0) particle.x = width;
        
        if (particle.y > height) particle.y = 0;
        else if (particle.y < 0) particle.y = height;
        
        ctx.fillStyle = particle.color;
        ctx.beginPath();
        ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
        ctx.fill();
      });
      
      requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener("resize", resize);
    draw();

    return () => {
      window.removeEventListener("resize", resize);
    };
  });

  return (
    <canvas
      id={id}
      ref={canvasRef}
      className={className}
    />
  );
};