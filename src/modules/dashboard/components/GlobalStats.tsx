type GlobalStatsProps = {
	totalResponses: number;
};

export default function GlobalStats({ totalResponses }: GlobalStatsProps) {
	return (
		<div className="bg-white p-6 rounded-lg shadow flex flex-col items-center">
			<h2 className="text-2xl font-semibold mb-2 text-gray-700">
				Estadísticas Globales
			</h2>
			<p className="text-gray-600">
				Total de respuestas recopiladas:{" "}
				<span className="font-bold text-gray-800">{totalResponses}</span>
			</p>
		</div>
	);
}
