﻿import React from "react";
import { Bar } from "react-chartjs-2";
import { Chart, registerables } from 'chart.js';
import style from '../styles/mixStatistic.module.css';
import 'chartjs-plugin-zoom';
import zoomPlugin from 'chartjs-plugin-zoom';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import IconButton from '@mui/material/IconButton';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import DashboardCustomizeIcon from '@mui/icons-material/DashboardCustomize';
import Tooltip from '@mui/material/Tooltip';
import { toast } from "react-toastify";
import { Modal, Box, Typography } from "@mui/material";
import CreateTrelloCard from "./CreateTrelloCard";
Chart.register(...registerables);
Chart.register(zoomPlugin);

const styleModal = {
	borderRadius: 3,
	position: 'absolute' as 'absolute',
	top: '50%',
	left: '50%',
	transform: 'translate(-50%, -50%)',
	width: 400,
	bgcolor: 'white',
	border: '1px solid #000',
	boxShadow: 24,
	p: 4,
  };

interface FacultyInteractionChartProps {
	data: {
		entities: string[];
		interactions: number[][];
		interactionTypes: string[];
		rotate: number;
	},
	trelloKey: string;
	trelloApiKey: string;
}

const colors = [
	'rgba(255, 0, 0, 0.6)',
	'rgba(0, 255, 0, 0.6)',
	'rgba(0, 0, 255, 0.6)',
	'rgba(255, 255, 0, 0.6)',
	'rgba(255, 0, 255, 0.6)',
	'rgba(0, 255, 255, 0.6)',
	'rgba(255, 128, 0, 0.6)',
	'rgba(128, 0, 255, 0.6)',
	'rgba(128, 255, 0, 0.6)',
	'rgba(0, 255, 128, 0.6)',
];

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
	data, trelloKey, trelloApiKey
}) => {
	const { entities, interactions, interactionTypes, rotate} = data;
	const [stacked, setStacked] = React.useState<boolean>(true);
	const [modalOpen, setModalOpen] = React.useState<boolean>(false);
	const chartRef = React.useRef<Chart<"bar", number[], string[]>>(null);

	const closeModal = () => {
		setModalOpen(false);
	};

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

	function dataURItoBlob(dataURI: string) {
		// convert base64/URLEncoded data component to raw binary data held in a string
		var byteString;
		if (dataURI.split(',')[0].indexOf('base64') >= 0)
			byteString = atob(dataURI.split(',')[1]);
		else
			byteString = unescape(dataURI.split(',')[1]);
		// separate out the mime component
		var mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0];
		// write the bytes of the string to a typed array
		var ia = new Uint8Array(byteString.length);
		for (var i = 0; i < byteString.length; i++) {
			ia[i] = byteString.charCodeAt(i);
		}
		return new Blob([ia], {type:mimeString});
	}

	const getImageAsFile = () => {
		let chart = chartRef.current;
		if (chart) {
			const dataUrl = chart.canvas.toDataURL('image/png');
			const blob = dataURItoBlob(dataUrl);
			return new File([blob as Blob], 'chart.png', { type: 'image/png' });
		}
		return null;
	};

	const chartData = {
		labels: entities.map((entity) => {
			return strToArray(entity, 30);
		}),
		datasets: interactionTypes.map((type, index) => ({
			label: type,
			data: interactions.map((interaction) => interaction[index]),
			backgroundColor: colors[index],
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
				<div>
					<Tooltip title="Створити картку в Trello">
						<IconButton aria-label="addСard" onClick={() => setModalOpen(true)}>
							<DashboardCustomizeIcon className={style.contentCopyIcon}/>
						</IconButton>
					</Tooltip>
					<Tooltip title="Експортувати як картинку в буфер">
						<IconButton aria-label="copyImage" onClick={() => saveImageToClipBoard()}>
							<ContentCopyIcon className={style.contentCopyIcon}/>
						</IconButton>
					</Tooltip>
				</div>
			</div>
			<Modal
				open={modalOpen}
				onClose={() => setModalOpen(false)}
			>
				<Box sx={styleModal}>
					<CreateTrelloCard trelloKey={trelloKey} trelloApiKey={trelloApiKey} closeModal={closeModal} image={getImageAsFile}/>
				</Box>
			</Modal>
		</>
	);

	return(
		<>
			{plotControl}
			<div>
				<Bar ref={chartRef} data={chartData} options={chartOptions} height={480}/>
			</div>
		</>

		
	);
};

export default BarChart;

