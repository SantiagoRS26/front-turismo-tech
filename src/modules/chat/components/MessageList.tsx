"use client";

import React from "react";
import ReactMarkdown from "react-markdown";

type MessageType = {
	role: "user" | "bot";
	content: string;
};

interface MessageListProps {
	messages: MessageType[];
	isBotTyping: boolean;
}

const MessageList: React.FC<MessageListProps> = ({ messages, isBotTyping }) => {
	return (
		<>
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
