import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
Chart.register(...registerables);

interface FacultyInteractionChartProps {
	data: {
		entities: string[];
		interactions: number[][];
		interactionTypes: string[];
		max: number;
	};
}

const strToArray = (str: string, limit: number) => {
	const words = str.split(' ')
	let aux = []
	let concat = []

	for (let i = 0; i < words.length; i++) {
		concat.push(words[i])
		let join = concat.join(' ')
		if (join.length > limit) {
			aux.push(join)
			concat = []
		}
	}

	if (concat.length) {
		aux.push(concat.join(' ').trim())
	}

	return aux
}

const BarChart: React.FC<FacultyInteractionChartProps> = ({
	data
}) => {
	const { entities, interactions, interactionTypes, max } = data;

	const chartData = {
		labels: entities.map((entity) => {
			return strToArray(entity, 15);
		}),
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

	console.log(chartData.labels);

	const chartOptions = {
		scales: {
			y: {
				stacked: true,
				beginAtZero: true,
			},
			x: {
				stacked: true,
			}
		},
		plugins: {
			legend: {
				position: 'top' as const,
			},
			label: {
				display: false,
			}
		},
		maintainAspectRatio: false
	};

	return <Bar data={chartData} options={chartOptions} height={500}/>;
};

export default BarChart;
