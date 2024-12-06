"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import ChatInput from "./ChatInput";
import MessageList from "./MessageList";
import ChatHeader from "./ChatHeader";

type MessageType = {
  role: "user" | "bot";
  content: string;
};

interface ChatBotProps {
  messages: MessageType[];
  isBotTyping: boolean;
  onSendMessage: (message: string) => void;
}

const ChatBot: React.FC<ChatBotProps> = ({ messages, isBotTyping, onSendMessage }) => {
  const [errorMessage, setErrorMessage] = useState("");
  const messageEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isBotTyping]);

  // Efecto para Text-to-Speech cada vez que llegue un nuevo mensaje del bot
  useEffect(() => {
    const lastMessage = messages[messages.length - 1];
    if (lastMessage && lastMessage.role === "bot") {
      const utterance = new SpeechSynthesisUtterance(lastMessage.content);
      // Opcional: elegir voz, idioma u otras propiedades del utterance
      // utterance.lang = "es-ES"; // Por ejemplo, para español
      speechSynthesis.speak(utterance);
    }
  }, [messages]);

  const handleSend = (input: string) => {
    const MAX_QUESTION_LENGTH = 200;
    if (!input.trim()) return;

    if (input.length > MAX_QUESTION_LENGTH) {
      setErrorMessage(
        `La pregunta es demasiado larga. El máximo permitido es de ${MAX_QUESTION_LENGTH} caracteres.`
      );
      return;
    }

    setErrorMessage("");
    onSendMessage(input);
  };

  return (
    <div className="w-full h-full flex flex-col p-6 bg-white/30 backdrop-blur-md rounded-lg shadow-[0_0_15px_rgba(255,255,255,0.2)] dark:bg-gray-800/30 dark:shadow-[0_0_15px_rgba(0,0,0,0.3)]">
      <ChatHeader />
      <div className="flex-grow p-4 overflow-y-auto w-full rounded-lg">
        <MessageList messages={messages} isBotTyping={isBotTyping} />
        <div ref={messageEndRef}></div>
      </div>
      <ChatInput onSend={handleSend} disabled={isBotTyping} />
      {errorMessage && (
        <p className="text-red-500 dark:text-red-400 text-sm mt-2">{errorMessage}</p>
      )}
    </div>
  );
};

export default ChatBot;
