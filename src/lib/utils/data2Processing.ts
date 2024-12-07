import { generateGeoJSONFromResponses } from "@/lib/utils/dataProcessing";
import { getResponseCounts } from "@/services/graphql/queries";
import { client } from "@/lib/client";
import { useEffect, useState } from "react";

interface ParsedResponseCounts {
	datetime_counts: Record<string, number>;
	response_counts: Record<string, Record<string, number>>;
}

export async function fetchResponseCountsData(): Promise<ParsedResponseCounts> {
	try {
		const result = await client.graphql({
			query: getResponseCounts,
		});

		if ("data" in result && result.data && result.data.getResponseCounts) {
			const { datetime_counts, response_counts } =
				result.data.getResponseCounts;
			const parsedDatetimeCounts = JSON.parse(datetime_counts);
			const parsedResponseCounts = JSON.parse(response_counts);

			return {
				datetime_counts: parsedDatetimeCounts,
				response_counts: parsedResponseCounts,
			};
		} else {
			console.error("Respuesta inesperada al obtener response counts:", result);
			return {
				datetime_counts: {},
				response_counts: {},
			};
		}
	} catch (error) {
		console.error("Error al obtener response counts:", error);
		return {
			datetime_counts: {},
			response_counts: {},
		};
	}
}

export function calculateGlobalStats(responseCounts: any) {
	let totalResponses = 0;
	for (const question in responseCounts) {
		const dataObj = responseCounts[question];
		if (typeof dataObj === "object") {
			totalResponses += Object.values(dataObj as Record<string, number>).reduce(
				(a: number, b: number) => a + b,
				0
			);
		}
	}
	return {
		totalResponses,
	};
}

export function useDashboardData() {
	const [datetime_counts, setDatetimeCounts] = useState<Record<string, number>>(
		{}
	);
	const [response_counts, setResponseCounts] = useState<
		Record<string, Record<string, number>>
	>({});
	const [globalStats, setGlobalStats] = useState<{ totalResponses: number }>({
		totalResponses: 0,
	});
	const [geoJSONData, setGeoJSONData] = useState<any>({
		type: "FeatureCollection",
		features: [],
	});

	useEffect(() => {
		const fetchData = async () => {
			const { datetime_counts, response_counts } =
				await fetchResponseCountsData();

			const totalResponses = Object.values(response_counts).reduce(
				(acc, questionObj) => {
					const sumForQuestion = Object.values(questionObj).reduce(
						(qAcc, val) => qAcc + val,
						0
					);
					return acc + sumForQuestion;
				},
				0
			);

			const geoJSONData = generateGeoJSONFromResponses(response_counts);

			setDatetimeCounts(datetime_counts);
			setResponseCounts(response_counts);
			setGlobalStats({ totalResponses });
			setGeoJSONData(geoJSONData);
		};

		fetchData();
	}, []);

	return { response_counts, datetime_counts, globalStats, geoJSONData };
}
