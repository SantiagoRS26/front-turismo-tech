"use client";
import ChatBot from "@/modules/chat/components/ChatBot";
import Image from "next/image";
import { motion } from "framer-motion";
import { Amplify } from "aws-amplify";

Amplify.configure({
	API: {
	  GraphQL: {
		endpoint: process.env.NEXT_PUBLIC_API_ENDPOINT || "",
		region: process.env.NEXT_PUBLIC_API_REGION,
		defaultAuthMode: "apiKey",
		apiKey: process.env.NEXT_PUBLIC_API_KEY,
	  },
	},
  });

export default function Home() {
	return (
		<div className="flex w-full h-screen bg-gradient-to-br from-blue-300 via-purple-400 to-pink-500 overflow-hidden">
			{/* Animación para la imagen */}
			<motion.div
				className="w-1/2 p-20 flex items-center justify-center"
				initial={{ opacity: 0, x: -100 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 1, ease: "easeOut" }}>
				<motion.div
					animate={{
						scale: [1, 1.05, 1], // Efecto de pulso
						rotate: [0, 1, -1, 0], // Ligero balanceo
					}}
					transition={{
						duration: 4, // Tiempo total de un ciclo
						repeat: Infinity, // Repetir indefinidamente
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

			{/* Animación para el ChatBot */}
			<motion.div
				className="w-1/2 p-8 flex items-center justify-center"
				initial={{ opacity: 0, x: 100 }}
				animate={{ opacity: 1, x: 0 }}
				transition={{ duration: 1, ease: "easeOut", delay: 0.5 }}>
				<ChatBot />
			</motion.div>
		</div>
	);
}
