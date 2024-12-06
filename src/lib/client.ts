import { Amplify } from "aws-amplify";
import { generateClient } from "aws-amplify/api";

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

export const client = generateClient();
