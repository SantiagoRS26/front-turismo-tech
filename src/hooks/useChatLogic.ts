"use client";

import { useState, useEffect, useRef } from "react";
import { v4 as uuidv4 } from "uuid";
import { client } from "@/lib/client";
import * as mutations from "@/services/graphql/mutations";
import * as queries from "@/services/graphql/queries";
import { detectCategoriesFromUserInterest } from "@/lib/utils/categoryDetector";
import { Place, Recommendations } from "@/modules/chat/types/Recommendations";

interface MessageType {
	role: "user" | "bot";
	content: string;
	recommendations?: Recommendations;
}

export function useChatLogic() {
	const [messages, setMessages] = useState<MessageType[]>([]);
	const [isBotTyping, setIsBotTyping] = useState(false);
	const [sessionId, setSessionId] = useState<string>(uuidv4());
	const [userInterestCategories, setUserInterestCategories] = useState<
		string[]
	>([]);
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

	const fetchRecommendations = async (
		categories: string[]
	): Promise<Recommendations> => {
		try {
			const allPlaces: Place[] = [];

			for (const category of categories) {
				const result = await client.graphql({
					query: queries.getLocations,
					variables: { categoryLocation: category },
				});

				if ("data" in result && result.data && result.data.getLocations) {
					const places: Place[] = result.data.getLocations.map((loc: any) => ({
						name: loc.name,
						rating: String(loc.rating),
						reviews: String(loc.reviews),
						category: loc.category,
						address: loc.address,
						hours: loc.hours,
						services: loc.services,
						location: {
							latitude: String(loc.latitude),
							longitude: String(loc.longitude),
						},
						images: loc.images,
						google_maps_url: loc.google_maps_url,
					}));
					allPlaces.push(...places);
				} else {
					console.error("Respuesta inesperada al obtener ubicaciones:", result);
				}
			}

			return { places: allPlaces };
		} catch (error) {
			console.error("Error al obtener recomendaciones:", error);
			throw error;
		}
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
				let botResponse: string = result.data.sendMessage;

				const containsMapPhrase = botResponse
					.toLowerCase()
					.includes("mapa con las recomendaciones");

				if (containsMapPhrase) {
					botResponse = botResponse
						.replace(/mapa con las recomendaciones/gi, "")
						.trim();
				}

				setMessages((prev) => [...prev, { role: "bot", content: botResponse }]);

				if (containsMapPhrase) {
					const fetchedRecommendations = await fetchRecommendations(
						userInterestCategories
					);
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

	return {
		messages,
		isBotTyping,
		sendMessage,
		recommendations,
	};
}
