import { cityCoordinates } from "./cityCoordinates";

interface ResponseCounts {
	[question: string]: {
		[answer: string]: number;
	};
}

export function generateGeoJSONFromResponses(responseCounts: ResponseCounts) {
	const citiesData = responseCounts["¿De donde nos visitas?"];

	const features = Object.entries(citiesData)
		.map(([city, count]) => {
			const coords = cityCoordinates[city.toLowerCase()];
			if (!coords) {
				return null;
			}

			return {
				type: "Feature",
				geometry: {
					type: "Point",
					coordinates: [coords.lng, coords.lat],
				},
				properties: {
					city: city,
					count: count,
				},
			};
		})
		.filter(Boolean);

	return {
		type: "FeatureCollection",
		features: features as any[],
	};
}
