import { motion, AnimatePresence } from 'framer-motion';
import { ChatInput } from '@/components/chat-input';
import { ChatHeader } from './ChatHeader';

export function ChatInputArea({ chat }: { chat: any }) {
  return (
    <div className="absolute inset-0 pointer-events-none flex flex-col z-10 pt-4 md:pt-8">
      <div
        className={`absolute inset-x-0 bottom-0 h-32 md:h-40 bg-gradient-to-t from-[#151515] via-[#151515]/80 to-transparent pointer-events-none transition-opacity duration-700 ${chat.isNewChat ? 'opacity-0' : 'opacity-100'} z-0`}
      />

      <div
        className={`relative z-10 flex-1 flex flex-row w-full transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] ${chat.isNewChat ? 'items-center pb-[10vh] md:pb-[15vh]' : 'items-end pb-2 md:pb-4'}`}
      >
        {chat.isNewChat && chat.isSidebarOpen && (
          <div className="hidden md:block w-[0rem] shrink-[5] transition-all duration-300" />
        )}
        <div className="pointer-events-auto w-[94%] sm:w-[86%] md:w-[72%] lg:w-[68%] lg:max-w-3xl mx-auto px-2 sm:px-4 md:px-6 lg:px-8">
          <AnimatePresence mode="popLayout">
            {chat.isNewChat && <ChatHeader greeting={chat.greeting} />}
          </AnimatePresence>

          <motion.div
            layout
            transition={{ type: 'spring', bounce: 0, duration: 0.7 }}
            className="w-full"
          >
            <ChatInput
              inputValue={chat.inputValue}
              setInputValue={chat.setInputValue}
              onSubmit={chat.submitForm}
              isStreaming={chat.isStreaming}
              status={chat.status}
              stop={chat.stop}
            />
            <AnimatePresence>
              {chat.isNewChat && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ delay: 0.2, duration: 0.5 }}
                  className="flex flex-wrap items-center justify-center gap-1.5 md:gap-2 mt-4 md:mt-6 px-2"
                >
                  {['Write', 'Learn', 'Code', 'Life stuff'].map((pill) => (
                    <button
                      key={pill}
                      type="button"
                      onClick={() =>
                        chat.setInputValue(`Help me ${pill.toLowerCase()}`)
                      }
                      className="px-3 py-1.5 md:px-4 md:py-2 rounded-full border border-border/50 bg-[#111111] hover:bg-muted text-xs md:text-sm text-muted-foreground transition-colors flex items-center gap-2 whitespace-nowrap"
                    >
                      {pill}
                    </button>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
