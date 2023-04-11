import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import style from '../styles/mixStatistic.module.css';
import 'chartjs-plugin-zoom';
import zoomPlugin from 'chartjs-plugin-zoom';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Tooltip from '@mui/material/Tooltip';
import { toast } from "react-toastify";
Chart.register(...registerables);
Chart.register(zoomPlugin);


interface FacultyInteractionChartProps {
	data: {
		entities: string[];
		interactions: number[][];
		interactionTypes: string[];
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
	const { entities, interactions, interactionTypes, rotate} = data;
	const [stacked, setStacked] = React.useState<boolean>(true);
	const chartRef = React.useRef<Chart<"bar", number[], string[]>>(null);

	const saveImageToClipBoard = () => {
		let chart = chartRef.current;
		if (chart) {
			chart.canvas.toBlob((blob) => {
				try {
					navigator.clipboard.write([
						new ClipboardItem({
							'image/png': blob as Blob,
						}),
					]);
					toast.success('Графік додано в буфер обміну ctrl+v для вставки', {
						position: 'bottom-center',
						autoClose: 3000,
						hideProgressBar: false,
						closeOnClick: true,
						pauseOnHover: true
					});
				} catch (err) {
					toast.error('Помилка при копіюванні графіка, надайте дозвіл');
				}
			});
		}
	};

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
				stacked: stacked,
				beginAtZero: true,
				ticks: {
					font : {
						size: 10
					}
				}
			},
			x: {
				type: 'category' as const,
				stacked: stacked,
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
				labels: {
					fontSize: 10,
					boxWidth: 10,
					padding: 10,
				}
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

	const plotControl = (
		<>
			<div className={style.plotControl}>
				<FormControlLabel
					value={stacked}
					control={<Switch sx={{
						"& .MuiSwitch-switchBase.Mui-checked": {
							color: "#616161"
						}, "& .MuiSwitch-switchBase.Mui-checked+.MuiSwitch-track": {
							backgroundColor: '#e1e1e1'
						}
					}} color="primary" size="small"/>}
					label="Групувати"
					labelPlacement="end"
					onChange={() => setStacked(!stacked)}
					className={style.switch}
				/>
				<Tooltip title="Експортувати як картинку в буфер">
					<IconButton aria-label="copyImage" onClick={() => saveImageToClipBoard()}>
						<ContentCopyIcon className={style.contentCopyIcon}/>
					</IconButton>
				</Tooltip>
				
			</div>
		</>
	);

	return(
		<>
			{plotControl}
			<div>
				<Bar ref={chartRef} data={chartData} options={chartOptions} height={500}/>
			</div>
		</>

		
	);
};

export default BarChart;
