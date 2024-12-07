"use client";

import ChatBot from "@/modules/chat/components/ChatBot";
import Image from "next/image";
import { motion } from "framer-motion";
import { useChatLogic } from "@/hooks/useChatLogic";

export default function Home() {
  const { messages, isBotTyping, sendMessage } = useChatLogic();

  return (
    <div className="flex flex-col lg:flex-row w-full h-screen bg-gradient-to-br from-blue-300 via-purple-400 to-pink-500 overflow-x-hidden">
      <motion.div
        className="w-full lg:w-1/2 p-8 lg:p-20 flex items-center justify-center"
        initial={{ opacity: 0, x: -100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut" }}
      >
        <motion.div
          animate={{
            scale: [1, 1.05, 1],
            rotate: [0, 1, -1, 0],
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            repeatType: "loop",
            ease: "easeInOut",
          }}
        >
          <Image
            src="/images/asistente_virtual.png"
            alt="Asistente Virtual"
            className="h-full object-contain"
            width={500}
            height={500}
          />
        </motion.div>
      </motion.div>

      <motion.div
        className="w-full lg:w-1/2 p-8 flex items-center justify-center"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}
      >
        <ChatBot
          messages={messages}
          isBotTyping={isBotTyping}
          onSendMessage={sendMessage}
        />
      </motion.div>
    </div>
  );
}
