import { Line } from "react-chartjs-2";
import { baseChartOptions } from "@/lib/utils/chartUtils";

type TimeSeriesChartsProps = {
	datetimeData: any;
	dailyCountsData: any;
};

export default function TimeSeriesCharts({
	datetimeData,
	dailyCountsData,
}: TimeSeriesChartsProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 gap-8">
			<div className="bg-white p-4 rounded shadow w-full min-h-[300px] flex flex-col">
				<h2 className="text-xl font-semibold mb-4">
					Visitas en el tiempo (por timestamp)
				</h2>
				<div className="flex-grow relative">
					<Line
						data={datetimeData}
						options={baseChartOptions}
					/>
				</div>
			</div>
			<div className="bg-white p-4 rounded shadow w-full min-h-[300px] flex flex-col">
				<h2 className="text-xl font-semibold mb-4">Visitas por día</h2>
				<div className="flex-grow relative">
					<Line
						data={dailyCountsData}
						options={baseChartOptions}
					/>
				</div>
			</div>
		</div>
	);
}
