"use client";

import React, { useState, useEffect, useRef } from "react";
import { FaPaperPlane, FaRobot } from "react-icons/fa";
import ReactMarkdown from "react-markdown";
import { motion } from "framer-motion";

const MAX_QUESTION_LENGTH = 200;

// Función para generar respuestas estáticas del bot
const getStaticBotResponse = (userMessage: string): string => {
	const lowerCaseMessage = userMessage.toLowerCase();
	if (lowerCaseMessage.includes("hola")) {
		return "¡Hola! ¿En qué puedo ayudarte hoy?";
	}
	if (lowerCaseMessage.includes("movilidad")) {
		return "Claro, puedo ayudarte con información sobre movilidad. ¿Qué necesitas saber?";
	}
	if (lowerCaseMessage.includes("gracias")) {
		return "¡De nada! Si tienes alguna otra pregunta, no dudes en decírmelo.";
	}
	// Respuesta por defecto
	return "Lo siento, no entendí tu pregunta. ¿Podrías reformularla?";
};

const ChatBot: React.FC = () => {
	const [input, setInput] = useState("");
	const [messages, setMessages] = useState<{ role: string; content: string }[]>(
		[]
	);
	const [isLoading, setIsLoading] = useState(false);
	const [errorMessage, setErrorMessage] = useState("");
	const messageEndRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
	}, [messages]);

	const sendMessage = async () => {
		if (!input.trim()) return;

		if (input.length > MAX_QUESTION_LENGTH) {
			setErrorMessage(
				`La pregunta es demasiado larga. El máximo permitido es de ${MAX_QUESTION_LENGTH} caracteres.`
			);
			return;
		}

		setErrorMessage("");

		const newMessage = { role: "user", content: input };
		setMessages((prevMessages) => [...prevMessages, newMessage]);
		setInput("");
		setIsLoading(true);

		// Simular una llamada a la API con un retraso
		setTimeout(() => {
			const botResponse = getStaticBotResponse(input);
			setMessages((prevMessages) => [
				...prevMessages,
				{ role: "bot", content: botResponse },
			]);
			setIsLoading(false);
		}, 2000); // 1 segundo de retraso
	};

	return (
		<div className="w-full h-full flex flex-col p-6 bg-white/30 backdrop-blur- shadow-lg rounded-lg dark:bg-gray-800/50">
			{/* Encabezado del ChatBot */}
			<div className="flex items-center space-x-3 mb-4">
				<motion.div
					initial={{ scale: 1 }}
					animate={{
						rotate: [0, 15, -15, 0],
						scale: [1, 1.2, 1],
						transition: { duration: 1.25, repeat: Infinity },
					}}>
					<FaRobot className="h-8 w-8 text-white dark:text-gray-700" />
				</motion.div>

				<div>
					<motion.h2
						className="text-xl font-bold text-white dark:text-gray-700"
						initial={{ opacity: 0, y: -10 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ duration: 0.8, ease: "easeInOut" }}>
						Turisty
					</motion.h2>
					<motion.p
						className="text-sm text-white dark:text-gray-700"
						initial={{ opacity: 0, x: -10 }}
						animate={{ opacity: 1, x: 0 }}
						transition={{
							delay: 0.2,
							duration: 0.8,
							ease: "easeInOut",
						}}>
						Tu asistente virtual de turismo
					</motion.p>
				</div>
			</div>

			<div className="flex-grow p-4 overflow-y-auto w-full rounded-lg">
				{messages.map((message, index) => (
					<div
						key={index}
						className={`my-2 flex ${
							message.role === "user" ? "justify-end" : "justify-start"
						}`}>
						<div
							className={`px-4 py-2 rounded-2xl max-w-full ${
								message.role === "user"
									? "bg-blue-500/70 text-white dark:bg-blue-400/70"
									: "bg-white/70 text-gray-600 dark:bg-gray-600/70 dark:text-gray-200"
							}`}>
							{message.role === "bot" ? (
								<ReactMarkdown>{message.content}</ReactMarkdown>
							) : (
								message.content
							)}
						</div>
					</div>
				))}
				{isLoading && (
					<div className="my-2 flex justify-start">
						<div className="px-4 py-2 rounded-2xl bg-white/70 text-gray-800 dark:bg-gray-600/70 dark:text-gray-300 flex items-center space-x-2">
							<span className="dot w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-300"></span>
							<span className="dot w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-300"></span>
							<span className="dot w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-300"></span>
						</div>
					</div>
				)}

				<div ref={messageEndRef}></div>
			</div>
			<div className="flex items-center w-full mt-4">
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					onKeyDown={(e) => e.key === "Enter" && sendMessage()}
					placeholder="Escribe tu mensaje..."
					className="flex-grow p-3 border border-gray-300 dark:border-gray-600 rounded-full bg-white/50 dark:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-gray-900 dark:text-gray-300 placeholder-gray-500 dark:placeholder-gray-500 transition-all duration-300"
				/>
				<button
					onClick={sendMessage}
					className="ml-4 p-3 bg-gradient-to-r from-blue-500 to-pink-500 text-white rounded-full shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:scale-105 focus:outline-none">
					<FaPaperPlane className="h-5 w-5" />
				</button>
			</div>
			{errorMessage && (
				<p className="text-red-500 dark:text-red-400 text-sm mt-2">
					{errorMessage}
				</p>
			)}
		</div>
	);
};

export default ChatBot;
