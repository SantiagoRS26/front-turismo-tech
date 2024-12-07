"use client";

import { useMemo } from "react";
import {
	Chart as ChartJS,
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement,
	RadialLinearScale,
} from "chart.js";
import { useDashboardData } from "@/lib/utils/data2Processing";
import {
	generateTimeSeriesData,
	generateDailyCountLineData,
	generateRadarData,
} from "@/lib/utils/chartUtils";
import MapView from "@/modules/map/components/MapView";
import GlobalStats from "@/modules/dashboard/components/GlobalStats";
import ChartsSection from "@/modules/dashboard/components/ChartsSection";
import TimeSeriesCharts from "@/modules/dashboard/components/TimeSeriesCharts";
import RadarChartSection from "@/modules/dashboard/components/RadarChartSection";
import ImprovementIdeas from "@/modules/dashboard/components/ImprovementIdeas";

ChartJS.register(
	CategoryScale,
	LinearScale,
	BarElement,
	Title,
	Tooltip,
	Legend,
	ArcElement,
	PointElement,
	LineElement,
	RadialLinearScale
);

export default function Dashboard() {
	const { response_counts, datetime_counts, globalStats, geoJSONData } =
		useDashboardData();

	const chartConfigs = [
		{
			question: "¿De donde nos visitas?",
			data: response_counts["¿De donde nos visitas?"],
		},
		{
			question: "¿Vienes con tu familia, amigos o solo?",
			data: response_counts["¿Vienes con tu familia, amigos o solo?"],
		},
		{
			question: "¿Con cuantas personas viajas?",
			data: response_counts["¿Con cuantas personas viajas?"],
		},
		{
			question:
				"¿Qué intereses turísticos tienes (entretenimiento, comida, actividades)?",
			data: response_counts[
				"¿Qué intereses turísticos tienes (entretenimiento, comida, actividades)?"
			],
		},
		{
			question: "¿Cuánto tiempo nos visitarás?",
			data: response_counts["¿Cuánto tiempo nos visitarás?"],
		},
		{
			question: "¿Tienes un presupuesto definido?",
			data: response_counts["¿Tienes un presupuesto definido?"],
		},
	];

	const datetimeData = useMemo(
		() => generateTimeSeriesData(response_counts.datetime),
		[response_counts]
	);
	const dailyCountsData = useMemo(
		() => generateDailyCountLineData(datetime_counts),
		[datetime_counts]
	);
	const interestsDataObj =
		response_counts[
			"¿Qué intereses turísticos tienes (entretenimiento, comida, actividades)?"
		];
	const radarData = useMemo(
		() => generateRadarData(interestsDataObj),
		[interestsDataObj]
	);

	return (
		<div className="p-4 md:p-10 bg-gray-100 min-h-screen flex flex-col gap-8">
			<h1 className="text-2xl md:text-4xl font-bold mb-8 text-center text-gray-800">
				Dashboard Turístico
			</h1>

			<GlobalStats totalResponses={globalStats.totalResponses} />

			<div className="bg-white p-4 rounded shadow w-full">
				<h2 className="text-lg md:text-xl font-semibold mb-4">
					Mapa de Origen de Visitas (Colombia)
				</h2>
				<p className="text-gray-600 mb-4 text-sm md:text-base">
					Visualiza un mapa de calor de las ciudades desde donde nos visitan.
				</p>
				<div
					className="w-full"
					style={{ minHeight: "400px" }}>
					<MapView geoJSONData={geoJSONData} />
				</div>
			</div>

			<ChartsSection chartConfigs={chartConfigs} />

			<TimeSeriesCharts
				datetimeData={datetimeData}
				dailyCountsData={dailyCountsData}
			/>

			<RadarChartSection radarData={radarData} />

			<ImprovementIdeas />
		</div>
	);
}
