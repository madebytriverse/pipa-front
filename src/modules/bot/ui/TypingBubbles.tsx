import { motion } from "framer-motion";

export default function TypingBubbles() {
  return (
    <div className="flex items-center gap-1 bg-gray-100 p-3 rounded-2xl w-fit shadow-sm">
      <motion.span
        className="w-2.5 h-2.5 bg-naranja rounded-full"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
        }}
      />
      <motion.span
        className="w-2.5 h-2.5 bg-naranja rounded-full"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          delay: 0.2,
        }}
      />
      <motion.span
        className="w-2.5 h-2.5 bg-naranja rounded-full"
        animate={{
          y: [0, -6, 0],
        }}
        transition={{
          duration: 0.6,
          repeat: Infinity,
          repeatType: "loop",
          ease: "easeInOut",
          delay: 0.4,
        }}
      />
    </div>
  );
}
