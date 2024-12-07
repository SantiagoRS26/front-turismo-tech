"use client";

import ChatBot from "@/modules/chat/components/ChatBot";
import Image from "next/image";
import { motion } from "framer-motion";
import { useState, useEffect, useRef } from "react";
import * as mutations from "@/services/graphql/mutations";
import { v4 as uuidv4 } from "uuid";
import { client } from "@/lib/client";
import { detectCategoriesFromUserInterest } from "@/lib/utils/categoryDetector";
import recommendationsData from "@/recommendations.json";
import { Recommendations } from "@/modules/chat/types/Recommendations";

interface MessageType {
	role: "user" | "bot";
	content: string;
}

export default function Home() {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [isBotTyping, setIsBotTyping] = useState(false);
	const [sessionId, setSessionId] = useState<string>(uuidv4());
	const [userInterestCategories, setUserInterestCategories] = useState<string[]>([]);
	const [recommendations, setRecommendations] =
		useState<Recommendations | null>(null);

	const inactivityTimer = useRef<NodeJS.Timeout | null>(null);

	const resetSessionId = () => {
		setSessionId(uuidv4());
	};

	const resetInactivityTimer = () => {
		if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
		inactivityTimer.current = setTimeout(() => {
			resetSessionId();
		}, 60000);
	};

	useEffect(() => {
		const handleUserActivity = () => {
			resetInactivityTimer();
		};

		window.addEventListener("mousemove", handleUserActivity);
		window.addEventListener("keydown", handleUserActivity);

		resetInactivityTimer();

		return () => {
			window.removeEventListener("mousemove", handleUserActivity);
			window.removeEventListener("keydown", handleUserActivity);
			if (inactivityTimer.current) clearTimeout(inactivityTimer.current);
		};
	}, []);

	const fetchRecommendations = async (): Promise<Recommendations> => {
		return new Promise((resolve) => {
			setTimeout(() => {
				resolve(recommendationsData);
			}, 1000);
		});
	};

	const sendMessage = async (humanMessage: string) => {
		const categories = detectCategoriesFromUserInterest(humanMessage);
		if (categories.length > 0) {
			setUserInterestCategories((prev) => {
				const newCategories = [...prev];
				categories.forEach((category) => {
					if (!newCategories.includes(category)) {
						newCategories.push(category);
					}
				});
				return newCategories;
			});
			console.log(`Categorías detectadas: ${categories.join(", ")}`);
		}

		setMessages((prev) => [...prev, { role: "user", content: humanMessage }]);

		setIsBotTyping(true);
		try {
			const result = await client.graphql({
				query: mutations.sendMessage,
				variables: { humanMessage, sessionId },
			});

			if ("data" in result && result.data && result.data.sendMessage) {
				const botResponse: string = result.data.sendMessage;

                setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);

				if (botResponse.toLowerCase().includes("mapa con las recomendaciones")) {
                    const fetchedRecommendations = await fetchRecommendations();
                    console.log("Recomendaciones:", fetchedRecommendations);
                    setRecommendations(fetchedRecommendations);
                  
                    setMessages((prev) => [
                      ...prev,
                      {
                        role: "bot",
                        content: "Aquí tienes el mapa con las recomendaciones:",
                        recommendations: fetchedRecommendations,
                      },
                    ]);
                  }
			} else {
				console.error("Respuesta inesperada de la mutación:", result);
				setMessages((prev) => [
					...prev,
					{
						role: "bot",
						content: "Lo siento, hubo un problema con la respuesta.",
					},
				]);
			}
		} catch (error) {
			console.error("Error al enviar mensaje:", error);
			setMessages((prev) => [
				...prev,
				{
					role: "bot",
					content: "Ocurrió un error al tratar de obtener la respuesta.",
				},
			]);
		} finally {
			setIsBotTyping(false);
		}
	};

	return (
		<div className="flex w-full h-screen bg-gradient-to-br from-blue-300 via-purple-400 to-pink-500 overflow-hidden">
			<motion.div
				className="w-1/2 p-20 flex items-center justify-center"
				initial={{ opacity: 0, x: -100 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 1, ease: "easeOut" }}>
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
					}}>
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
				className="w-1/2 p-8 flex items-center justify-center"
				initial={{ opacity: 0, x: 100 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}>
				<ChatBot
					messages={messages}
					isBotTyping={isBotTyping}
					onSendMessage={sendMessage}
				/>
			</motion.div>
		</div>
	);
}
