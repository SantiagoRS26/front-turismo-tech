"use client";

import React, { useState } from "react";
import { FaPaperPlane, FaMicrophone, FaMicrophoneSlash } from "react-icons/fa";
import { useVoiceRecognition } from "../hooks/useVoiceRecognition";

interface ChatInputProps {
  onSend: (message: string) => void;
  disabled?: boolean; // Se agrega la prop para deshabilitar
}

const ChatInput: React.FC<ChatInputProps> = ({ onSend, disabled = false }) => {
  const [input, setInput] = useState("");

  const { listening, handleStartStopListening } = useVoiceRecognition({
    onSendMessage: (msg) => onSend(msg),
  });

  const handleSend = () => {
    if (input.trim()) {
      onSend(input.trim());
      setInput("");
    }
  };

  return (
    <div className="flex items-center w-full mt-4 space-x-2">
      <input
        type="text"
        value={input}
        disabled={disabled}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => !disabled && e.key === "Enter" && handleSend()}
        placeholder={disabled ? "Esperando respuesta del bot..." : "Escribe tu mensaje..."}
        className={`flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-300 ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      />

      <button
        onClick={handleStartStopListening}
        disabled={disabled}
        className={`p-3 bg-gradient-to-r from-green-500 to-green-600 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
        title={listening ? "Detener voz" : "Iniciar voz"}
      >
        {listening ? (
          <FaMicrophoneSlash className="h-5 w-5" />
        ) : (
          <FaMicrophone className="h-5 w-5" />
        )}
      </button>

      <button
        onClick={handleSend}
        disabled={disabled}
        className={`p-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none ${
          disabled ? "opacity-50 cursor-not-allowed" : ""
        }`}
      >
        <FaPaperPlane className="h-5 w-5" />
      </button>

      {listening && !disabled && (
        <p className="text-sm mt-2 text-gray-700 dark:text-gray-300">
          Escuchando...
        </p>
      )}
    </div>
  );
};

export default ChatInput;
