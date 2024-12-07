import { Radar } from "react-chartjs-2";
import { baseChartOptions } from "@/lib/utils/chartUtils";

type RadarChartSectionProps = {
	radarData: any;
};

export default function RadarChartSection({
	radarData,
}: RadarChartSectionProps) {
	return (
		<div className="bg-white p-4 rounded shadow w-full min-h-[300px] flex flex-col">
			<h2 className="text-xl font-semibold mb-4">
				Principales Intereses Turísticos (Top 5)
			</h2>
			<div className="flex-grow relative">
				<Radar
					data={radarData}
					options={baseChartOptions}
				/>
			</div>
		</div>
	);
}
