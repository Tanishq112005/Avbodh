import { motion } from 'framer-motion';
import { Bot } from 'lucide-react';

export function ChatHeader({ greeting }: { greeting: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ duration: 0.5 }}
      className="flex flex-col items-center justify-center text-center mb-6 md:mb-8"
    >
      <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium tracking-tight text-foreground flex items-center gap-2 md:gap-3">
        <Bot className="w-6 h-6 sm:w-8 sm:h-8 md:w-10 md:h-10 text-primary" />
        {greeting}
      </h2>
    </motion.div>
  );
}
