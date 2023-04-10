import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import 'chartjs-plugin-zoom';
import zoomPlugin from 'chartjs-plugin-zoom';
Chart.register(...registerables);
Chart.register(zoomPlugin);


interface FacultyInteractionChartProps {
	data: {
		entities: string[];
		interactions: number[][];
		interactionTypes: string[];
		max: number;
		rotate: number;
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
	const { entities, interactions, interactionTypes, max, rotate } = data;

	const chartData = {
		labels: entities.map((entity) => {
			return strToArray(entity, 30);
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

	const chartOptions = {
		scales: {
			y: {
				stacked: true,
				beginAtZero: true,
				ticks: {
					font : {
						size: 10
					}
				}
			},
			x: {
				type: 'category' as const,
				stacked: true,
				ticks: {
					autoSkip: false,
					minRotation: rotate,
					maxRotation: 90,
					font : {
						size: 10
					}
				},
			}
		},
		plugins: {
			legend: {
				position: 'top' as const,
			},
			label: {
				display: false,
			},
			zoom: {
				pan: {
					enabled: true,
					mode: 'x' as const,
				},
			}
		},
		maintainAspectRatio: false
	};

	return <Bar data={chartData} options={chartOptions} height={500}/>;
};

export default BarChart;
