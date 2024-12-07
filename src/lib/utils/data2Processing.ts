import responseData from "@/responseCounts.json";
import { generateGeoJSONFromResponses } from "@/lib/utils/dataProcessing";

export function calculateGlobalStats(responseCounts: any) {
	let totalResponses = 0;
	for (const question in responseCounts) {
		const dataObj = responseCounts[question];
		if (typeof dataObj === "object") {
			totalResponses += Object.values(dataObj as Record<string, number>).reduce((a: number, b: number) => a + b, 0);
		}
	}
	return {
		totalResponses,
	};
}

export function useDashboardData() {
	const { response_counts, datetime_counts } = responseData.getResponseCounts;
	const globalStats = calculateGlobalStats(response_counts);
	const geoJSONData = generateGeoJSONFromResponses(response_counts);

	return { response_counts, datetime_counts, globalStats, geoJSONData };
}
