import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface FacultyInteractionChartProps {
	data: {
		faculties: string[];
		interactions: number[][];
		interactionTypes: string[];
		max: number;
	};
}

const BarChart: React.FC<FacultyInteractionChartProps> = ({
	data
}) => {
	const { faculties, interactions, interactionTypes, max } = data;

	const chartData = {
		labels: faculties,
		datasets: interactionTypes.map((type, index) => ({
			label: type,
			data: interactions.map((interaction) => interaction[index]),
			backgroundColor: `rgba(${Math.floor(
				Math.random() * 256
			)}, ${Math.floor(Math.random() * 256)}, ${Math.floor(
				Math.random() * 256
			)}, 0.6)`,
		})),
	};

	const chartOptions = {
		scales: {
			y: {
				beginAtZero: true,
				max: max,
			},
		},
		maintainAspectRatio: false
	};

	return <Bar data={chartData} options={chartOptions} height={500}/>;
};

export default BarChart;
