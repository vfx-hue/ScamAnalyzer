import { motion } from "framer-motion";
import React, { useEffect, useRef } from "react";

interface AnimatedGradientBackgroundProps {
  startingGap?: number; // initial gradient size
  Breathing?: boolean; // enable breathing animation
  gradientColors?: string[]; // gradient colors
  gradientStops?: number[]; // stops for each color
  animationSpeed?: number; // speed of breathing
  breathingRange?: number; // range of breathing
  containerStyle?: React.CSSProperties; // extra styles
  containerClassName?: string; // extra classes
  topOffset?: number; // top offset percentage
}

const AnimatedGradientBackground: React.FC<AnimatedGradientBackgroundProps> = ({
  startingGap = 125,
  Breathing = true,
  gradientColors = ["#020617", "#0ea5e9", "#22d3ee"],
  gradientStops = [40, 55, 100],
  animationSpeed = 0.02,
  breathingRange = 15,
  containerStyle = {},
  containerClassName = "",
  topOffset = 0,
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Validate lengths
  if (gradientColors.length !== gradientStops.length) {
    throw new Error(
      `GradientColors and GradientStops must have the same length. Got ${gradientColors.length} and ${gradientStops.length}`
    );
  }

  useEffect(() => {
    let animationFrame: number;
    let width = startingGap;
    let direction = 1;

    const animate = () => {
      if (Breathing) {
        if (width >= startingGap + breathingRange) direction = -1;
        if (width <= startingGap - breathingRange) direction = 1;
        width += direction * animationSpeed;
      }

      // build gradient string
      const stops = gradientStops
        .map((stop, idx) => `${gradientColors[idx]} ${stop}%`)
        .join(", ");

      const gradient = `radial-gradient(${width}% ${width + topOffset}% at 50% 20%, ${stops})`;

      if (containerRef.current) {
        containerRef.current.style.background = gradient;
      }

      animationFrame = requestAnimationFrame(animate);
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [startingGap, Breathing, gradientColors, gradientStops, animationSpeed, breathingRange, topOffset]);

  return (
    <motion.div
      key="animated-gradient-background"
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1, transition: { duration: 1.8, ease: [0.25, 0.1, 0.25, 1] } }}
      className={`absolute inset-0 ${containerClassName}`}
    >
      <div
        ref={containerRef}
        style={{ ...containerStyle }}
        className="absolute inset-0 transition-transform"
      />
    </motion.div>
  );
};

export default AnimatedGradientBackground;