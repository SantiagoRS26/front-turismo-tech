/*     // pages/index.tsx
    'use client';

    import { useEffect, useRef, useState } from 'react';

    const SpeechRecognitionComponent = () => {
    const [transcript, setTranscript] = useState<string>('');
    const [listening, setListening] = useState<boolean>(false);
    const [lastSpokeTime, setLastSpokeTime] = useState<number>(Date.now());
    const [inactiveTime, setInactiveTime] = useState<number>(0);

    // @ts-ignore
    const recognitionRef = useRef<SpeechRecognition | null>(null);

    useEffect(() => {
        if (typeof window !== 'undefined') {
        // @ts-ignore
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.lang = 'es-ES';
            recognitionRef.current.continuous = true;
            recognitionRef.current.interimResults = false;

            recognitionRef.current.onstart = () => {
            console.log('Micrófono activado. Empiece a hablar.');
            setListening(true);
            };

            recognitionRef.current.onresult = ( event: any) => {
            let transcriptResult = '';
            for (let i = event.resultIndex; i < event.results.length; ++i) {
                transcriptResult += event.results[i][0].transcript;
            }
            console.log(`Transcripción: ${transcriptResult}`);
            setTranscript((prev) => prev + transcriptResult);
            setLastSpokeTime(Date.now());
            };

            recognitionRef.current.onerror = (event: any) => {
            console.error('Error en el reconocimiento: ' + event.error);
            };

            recognitionRef.current.onend = () => {
            console.log('Micrófono desactivado.');
            setListening(false);
            // Reinicia el reconocimiento para seguir escuchando
            recognitionRef.current?.start();
            };

            // Comienza el reconocimiento
            recognitionRef.current.start();
        } else {
            console.error('El reconocimiento de voz no es compatible con este navegador.');
        }
        }

        // Limpia al desmontar el componente
        return () => {
        recognitionRef.current?.stop();
        };
    }, []);

    useEffect(() => {
        // Temporizador para verificar inactividad
        const interval = setInterval(() => {
        const timeSinceLastSpeech = (Date.now() - lastSpokeTime) / 1000; // en segundos
        setInactiveTime(timeSinceLastSpeech);
        if (timeSinceLastSpeech > 5 && listening) {
            console.log(`No se detecta voz desde hace ${Math.floor(timeSinceLastSpeech)} segundos.`);
            // Puedes detener el reconocimiento aquí si lo deseas
            // recognitionRef.current?.stop();
        }
        }, 1000);

        // Limpia al desmontar el efecto
        return () => {
        clearInterval(interval);
        };
    }, [lastSpokeTime, listening]);

    return (
        <div>
        <h1>Demostración de Reconocimiento de Voz</h1>
        <p>{listening ? 'Escuchando...' : 'Micrófono apagado.'}</p>
        <p>Transcripción: {transcript}</p>
        {inactiveTime > 5 && (
            <p>No se detecta voz desde hace {Math.floor(inactiveTime)} segundos.</p>
        )}
        </div>
    );
    };

    export default SpeechRecognitionComponent;
 */

    "use client";

import { useVoiceRecognition } from "@/modules/chat/hooks/useVoiceRecognition";
import React, { useState } from "react";

const TestVoiceRecognition: React.FC = () => {
    const [transcriptions, setTranscriptions] = useState<string[]>([]);
    const { listening, handleStartStopListening } = useVoiceRecognition({
        onSendMessage: (message) => {
            setTranscriptions((prev) => [...prev, message]);
        },
    });

    return (
        <div className="p-6 bg-gray-800 rounded-lg shadow-md">
            <h2 className="text-lg font-bold mb-4">Prueba de Reconocimiento de Voz</h2>
            <button
                onClick={handleStartStopListening}
                className={`px-4 py-2 rounded ${
                    listening ? "bg-red-500" : "bg-green-500"
                } text-white`}>
                {listening ? "Detener" : "Iniciar"} Reconocimiento
            </button>
            <div className="mt-4">
                <h3 className="font-semibold">Transcripciones:</h3>
                <ul className="mt-2 space-y-2">
                    {transcriptions.map((transcription, index) => (
                        <li
                            key={index}
                            className="p-2 bg-white shadow rounded text-gray-800">
                            {transcription}
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default TestVoiceRecognition;
