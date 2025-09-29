// components/common/FadeInWrapper.jsx
import { motion } from "framer-motion";

const FadeInWrapper = ({
  children,
  delay = 0,
  duration = 0.8,
  y = 40,
  ...props
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration, ease: "easeOut" }}
      {...props}
    >
      {children}
    </motion.div>
  );
};

export default FadeInWrapper;
