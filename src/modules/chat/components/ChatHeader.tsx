"use client";

import React from "react";
import { FaRobot } from "react-icons/fa";
import { motion } from "framer-motion";

const ChatHeader: React.FC = () => {
	return (
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
	);
};

export default ChatHeader;
