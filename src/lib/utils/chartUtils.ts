import { Bar, Pie, Doughnut, Line, Radar } from "react-chartjs-2";

export function chooseChartType(
	dataObj: Record<string, number>,
	isTimeData = false
) {
	const numberOfCategories = Object.keys(dataObj).length;
	if (isTimeData) {
		return "line";
	}
	if (numberOfCategories <= 4) {
		return "doughnut";
	} else if (numberOfCategories <= 10) {
		return "pie";
	} else {
		return "bar";
	}
}

export function generateChartData(
	question: string,
	dataObj: Record<string, number>,
	chartType: string
) {
	const labels = Object.keys(dataObj);
	const values = Object.values(dataObj);

	const palette = [
		"#FFB3BA",
		"#FFDFBA",
		"#FFFFBA",
		"#BAFFC9",
		"#BAE1FF",
		"#C9C9FF",
		"#F3B3E9",
		"#B0EACD",
		"#FFDAC1",
		"#E2F0CB",
	];

	const backgroundColor = values.map((_, i) => palette[i % palette.length]);
	const borderColor = values.map(() => "rgba(0,0,0,0.1)");

	const baseDataset = {
		label: question,
		data: values,
		backgroundColor,
		borderColor,
		borderWidth: 1,
	};

	if (chartType === "line") {
		return {
			labels,
			datasets: [
				{
					...baseDataset,
					fill: false,
					borderColor: "rgba(75,192,192,1)",
					backgroundColor: "rgba(75,192,192,0.2)",
					tension: 0.1,
				},
			],
		};
	} else {
		return {
			labels,
			datasets: [baseDataset],
		};
	}
}

export function generateTimeSeriesData(dataObj: Record<string, number>) {
	const entries = Object.entries(dataObj).sort(
		(a, b) => new Date(a[0]).getTime() - new Date(b[0]).getTime()
	);
	const labels = entries.map((entry) => entry[0]);
	const values = entries.map((entry) => entry[1]);

	return {
		labels,
		datasets: [
			{
				label: "Visitas en el tiempo",
				data: values,
				fill: false,
				borderColor: "rgba(75,192,192,1)",
				backgroundColor: "rgba(75,192,192,0.2)",
				tension: 0.1,
			},
		],
	};
}

export function generateDailyCountLineData(dataObj: Record<string, number>) {
	const labels = Object.keys(dataObj).sort();
	const values = Object.values(dataObj);

	return {
		labels,
		datasets: [
			{
				label: "Visitas por día",
				data: values,
				fill: false,
				borderColor: "rgba(153,102,255,1)",
				backgroundColor: "rgba(153,102,255,0.2)",
				tension: 0.1,
			},
		],
	};
}

export function generateRadarData(dataObj: Record<string, number>) {
	const entries = Object.entries(dataObj).sort((a, b) => b[1] - a[1]);
	const topEntries = entries.slice(0, 5);
	const labels = topEntries.map(([k]) => k);
	const values = topEntries.map(([, v]) => v);

	return {
		labels,
		datasets: [
			{
				label: "Principales intereses",
				data: values,
				backgroundColor: "rgba(179,181,198,0.2)",
				borderColor: "rgba(179,181,198,1)",
				pointBackgroundColor: "rgba(179,181,198,1)",
				pointBorderColor: "#fff",
				pointHoverBackgroundColor: "#fff",
				pointHoverBorderColor: "rgba(179,181,198,1)",
			},
		],
	};
}

export const baseChartOptions = {
	responsive: true,
	maintainAspectRatio: false as boolean,
};

export function getChartComponent(chartType: string) {
	switch (chartType) {
		case "bar":
			return Bar;
		case "pie":
			return Pie;
		case "doughnut":
			return Doughnut;
		case "line":
			return Line;
		case "radar":
			return Radar;
		default:
			return Bar;
	}
}
