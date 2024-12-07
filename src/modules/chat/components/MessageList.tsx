"use client";

import React from "react";
import ReactMarkdown from "react-markdown";
import MapContainer from "@/modules/map/components/MapContainer";
import { Recommendations } from "@/modules/chat/types/Recommendations";

type MessageType = {
	role: "user" | "bot";
	content: string;
	recommendations?: Recommendations;
};

interface MessageListProps {
	messages: MessageType[];
	isBotTyping: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isBotTyping }) => {
	return (
		<>
			{messages.map((message, index) => {
				const isUser = message.role === "user";
				const baseClasses = `my-2 flex ${
					isUser ? "justify-end" : "justify-start"
				}`;
				const bubbleClasses = `px-4 py-2 rounded-2xl max-w-full ${
					isUser
						? "bg-blue-500/70 text-white dark:bg-blue-400/70"
						: "bg-white/70 text-gray-600 dark:bg-gray-600/70 dark:text-gray-200"
				}`;

				return (
					<div
						key={index}
						className={baseClasses}>
						{message.recommendations ? (
							<div className={`${bubbleClasses} w-full`}>
								<p className="mb-2">
									<ReactMarkdown>{message.content}</ReactMarkdown>
								</p>
								<div className="w-full h-96">
									<MapContainer places={message.recommendations.places} />
								</div>
							</div>
						) : (
							<div className={bubbleClasses}>
								{message.role === "bot" ? (
									<ReactMarkdown>{message.content}</ReactMarkdown>
								) : (
									message.content
								)}
							</div>
						)}
					</div>
				);
			})}

			{isBotTyping && (
				<div className="my-2 flex justify-start">
					<div className="px-4 py-2 rounded-2xl bg-white/70 text-gray-800 dark:bg-gray-600/70 dark:text-gray-300 flex items-center space-x-2">
						<span className="dot w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-300"></span>
						<span className="dot w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-300"></span>
						<span className="dot w-2 h-2 rounded-full bg-gray-800 dark:bg-gray-300"></span>
					</div>
				</div>
			)}
		</>
	);
};

export default MessageList;
