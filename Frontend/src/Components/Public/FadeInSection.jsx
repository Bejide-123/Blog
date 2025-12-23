// FadeInSection.jsx - CORRECTED VERSION
import React from "react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

// Simple FadeInSection component
const FadeInSection = ({ children, threshold = 0.1, delay = 0, duration = 0.8 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 40 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 40 }}
      transition={{ duration, delay, ease: "easeOut" }}
    >
      {children}
    </motion.div>
  );
};

// Simple SlideUp component
const SlideUp = ({ children, delay = 0, duration = 0.8, threshold = 0.1 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 60 }}
      animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 60 }}
      transition={{ 
        duration, 
        delay, 
        ease: [0.22, 1, 0.36, 1] 
      }}
    >
      {children}
    </motion.div>
  );
};

// Simple FadeIn component
const FadeIn = ({ children, delay = 0, duration = 0.6, threshold = 0.1 }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, threshold });

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0 }}
      animate={isInView ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration, delay }}
    >
      {children}
    </motion.div>
  );
};

// Export everything properly
export default FadeInSection;
export { SlideUp, FadeIn };