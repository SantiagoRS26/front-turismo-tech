"use client";

import { useState, useRef, useEffect, useCallback } from "react";

interface UseVoiceRecognitionParams {
	onSendMessage: (message: string) => void;
}

export const useVoiceRecognition = ({ onSendMessage }: UseVoiceRecognitionParams) => {
	const [listening, setListening] = useState<boolean>(false);
	const [transcript, setTranscript] = useState<string>("");
	const [partialTranscript, setPartialTranscript] = useState<string>("");
	const [lastSpokeTime, setLastSpokeTime] = useState<number>(Date.now());
    
	// @ts-ignore 
	const recognitionRef = useRef<SpeechRecognition | null>(null);

	const initializeSpeechRecognition = useCallback(() => {
		if (typeof window === "undefined") return;

		// @ts-ignore 
		const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
		if (SpeechRecognition) {
			const recognition = new SpeechRecognition();
			recognition.lang = "es-ES";
			recognition.continuous = true;
			// Permitir resultados interinos para tener retroalimentación en tiempo real
			recognition.interimResults = true;

			recognition.onstart = () => {
				setListening(true);
				setLastSpokeTime(Date.now());
			};

            // @ts-ignore 
			recognition.onresult = (event: SpeechRecognitionEvent) => {
				let finalChunk = "";
				let interimChunk = "";

				for (let i = event.resultIndex; i < event.results.length; i++) {
					const result = event.results[i];
					const text = result[0].transcript;
					// Si el resultado es final, se agrega a la transcripción final.
					// Si no es final, es interino.
					if (result.isFinal) {
						finalChunk += text;
					} else {
						interimChunk += text;
					}
				}

				// Actualizamos transcripciones
				if (finalChunk) {
					setTranscript(prev => prev + finalChunk);
					setPartialTranscript("");
					setLastSpokeTime(Date.now());
				} else {
					// Actualizamos la transcripción parcial en tiempo real
					setPartialTranscript(interimChunk);
				}
			};

			recognition.onerror = (event: any) => {
				console.error("Error en el reconocimiento: " + event.error);
			};

			recognition.onend = () => {
				setListening(false);
				// Si hay un texto final pendiente, se envía
				const finalText = (transcript + partialTranscript).trim();
				if (finalText !== "") {
					onSendMessage(finalText);
					setTranscript("");
					setPartialTranscript("");
				}
				// Si se quiere que el reconocimiento siga escuchando de forma continua, descomentar:
				// recognition.start();
			};

			recognitionRef.current = recognition;
		} else {
			console.error("El reconocimiento de voz no es compatible con este navegador.");
		}
	}, [onSendMessage, transcript, partialTranscript]);

	const handleStartStopListening = () => {
		if (!recognitionRef.current) {
			initializeSpeechRecognition();
		}

		if (listening) {
			// Si ya se está escuchando, paramos
			recognitionRef.current?.stop();
			setListening(false);
			const finalText = (transcript + partialTranscript).trim();
			if (finalText !== "") {
				onSendMessage(finalText);
			}
			setTranscript("");
			setPartialTranscript("");
		} else {
			// Comenzamos a escuchar
			setTranscript("");
			setPartialTranscript("");
			recognitionRef.current?.start();
		}
	};

	// Monitorear inactividad
	useEffect(() => {
		const interval = setInterval(() => {
			if (listening) {
				const timeSinceLastSpeech = (Date.now() - lastSpokeTime) / 1000;
				if (timeSinceLastSpeech > 2 && recognitionRef.current) {
					recognitionRef.current.stop();
					setListening(false);
					const finalText = (transcript + partialTranscript).trim();
					if (finalText !== "") {
						onSendMessage(finalText);
					}
					setTranscript("");
					setPartialTranscript("");
				}
			}
		}, 500);

		return () => clearInterval(interval);
	}, [lastSpokeTime, listening, transcript, partialTranscript, onSendMessage]);

	return {
		listening,
		handleStartStopListening,
	};
};
