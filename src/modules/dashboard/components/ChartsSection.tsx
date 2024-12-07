import {
	baseChartOptions,
	chooseChartType,
	generateChartData,
	getChartComponent,
} from "@/lib/utils/chartUtils";

type ChartsSectionProps = {
	chartConfigs: { question: string; data: Record<string, number> }[];
};

export default function ChartsSection({ chartConfigs }: ChartsSectionProps) {
	return (
		<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
			{chartConfigs.map((conf, index) => {
				const chartType = chooseChartType(
					conf.data,
					conf.question.toLowerCase().includes("tiempo") &&
						!conf.question.toLowerCase().includes("visitarás")
				);
				const chartData = generateChartData(
					conf.question,
					conf.data,
					chartType
				);
				const ChartComponent = getChartComponent(chartType);

				return (
					<div
						key={index}
						className="bg-white p-4 rounded shadow flex flex-col w-full min-h-[300px]">
						<h2 className="text-xl font-semibold mb-4">{conf.question}</h2>
						<div className="flex-grow relative">
							<ChartComponent
								data={chartData}
								options={baseChartOptions}
							/>
						</div>
					</div>
				);
			})}
		</div>
	);
}
