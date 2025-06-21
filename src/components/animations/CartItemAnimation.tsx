import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';
interface CartItemAnimationProps {
  imageUrl: string;
  startX: number;
  startY: number;
  endX: number;
  endY: number;
  onComplete: () => void;
}
export const CartItemAnimation = ({
  imageUrl,
  startX,
  startY,
  endX,
  endY,
  onComplete
}: CartItemAnimationProps) => {
  const controls = useAnimation();
  useEffect(() => {
    const animate = async () => {
      // Calculate the midpoint for the curve
      const midX = startX + (endX - startX) / 2;
      const midY = Math.min(startY, endY) - 100; // Curve upwards
      await controls.start({
        x: [startX, midX, endX],
        y: [startY, midY, endY],
        scale: [1, 0.8, 0.2],
        opacity: [1, 1, 0],
        transition: {
          duration: 0.8,
          ease: 'easeOut'
        }
      });
      onComplete();
    };
    animate();
  }, [controls, startX, startY, endX, endY, onComplete]);
  return <motion.div initial={{
    x: startX,
    y: startY,
    scale: 1,
    opacity: 1
  }} animate={controls} style={{
    position: 'fixed',
    zIndex: 100,
    pointerEvents: 'none',
    width: '50px',
    height: '50px',
    borderRadius: '8px',
    overflow: 'hidden'
  }}>
      <img src={imageUrl} alt="" className="w-full h-full object-cover" style={{
      borderRadius: 'inherit'
    }} />
    </motion.div>;
};