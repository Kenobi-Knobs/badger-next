import React, { CSSProperties, useEffect, useCallback } from 'react';
import CSVReader from 'react-csv-reader';
import style from './styles/mixStatistic.module.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';
import BarChart from './components/BarChart';
import { facultyOptions, interactionTypes, getFacultiesNames, getInteractions } from './utils/mixDataManager';

type Options = {
	facult: string;
	kathedra: string;
};

const MixStaistic = (props: any) => {
	const [data, setData] = React.useState<any>([]);
	const [DataLoaded, setDataLoaded] = React.useState<boolean>(false);
	const [statisticLoading, setStatisticLoading] = React.useState<boolean>(false);
	const [options, setOptions] = React.useState<Options>(
		{
			facult: 'all',
			kathedra: 'all',
		}
	);
	const [plot , setPlot] = React.useState<any>(<></>);

	const handleLoad = (data: any, fileInfo: any) => {
		setData(data);
		setDataLoaded(true);
	};

	const removeFile = () => {
		const input = document.getElementById('csv-input') as HTMLInputElement;
		input.value = '';
		setData([]);
		setDataLoaded(false);
		setOptions({
			facult: 'all',
			kathedra: 'all',
		});
	};

	const changeOptions = (value: string, input: string) => {
		if (input === 'facult') {
			setOptions({
				...options,
				kathedra: 'all',
				[input as keyof Options]: value
			});
		} else {
			setOptions({
				...options,
				[input as keyof Options]: value
			});
		}
	};

	const getKathedraOptions = (facult: string) => {
		let kathedraList = [] as { value: string; label: string }[];
		data.map((item: any) => {
			if (item['code_div']) {
				let facultId = item['code_div'].split('.')[0];
				if (facultId === facult) {
					if (!kathedraList.some((kathedra: any) => kathedra.value === item['code_div'])) {
						kathedraList.push({value: item['code_div'], label: item['name_div']});
					}
				}
			}
		});
		kathedraList.unshift({value: 'all', label: 'Всі'});
		return kathedraList;
	};

	const generatePlot = useCallback(() => {
		setStatisticLoading(true);
		if (options.facult == 'all' && options.kathedra == 'all') {
			const facultetNames = getFacultiesNames(data);
			const interactions = getInteractions(data, 'facultet');
			const plotData = {
				faculties: facultetNames,
				interactions: interactions,
				interactionTypes: interactionTypes,
				max: Math.max(...interactions.flat()) + 100
			};
	
			setPlot(
				<>
					<BarChart data={plotData} />
				</>
			);
		} else {
			setPlot(<></>);
		}
		setStatisticLoading(false);
	}, [options, data]);

	useEffect(() => {
		generatePlot();
	}, [generatePlot]);

	const content = (
		<>
			<div className={style.controlRow}>
				<div className={style.contentHeader}>Активності на платформі</div>
				<div className={style.contentDescription}>Керуйте параметрами відображення за допомогою налаштуваннь нижче</div>
				<div className={style.contentControlContainer}>
					<div className={style.controlDescription}>Факультет:</div>
					<Dropdown
						options={facultyOptions}
						value={facultyOptions[0]}
						controlClassName={style.dropdown}
						menuClassName={style.dropdownMenu}
						onChange={(option: any) => changeOptions(option.value, 'facult')}
					/>
					{options.facult !== 'all' && (
						<>
							<div className={style.controlDescription}>Кафедра:</div>
							<Dropdown
								options={getKathedraOptions(options.facult)}
								value={options.kathedra}
								controlClassName={style.dropdown}
								menuClassName={style.dropdownMenu}
								onChange={(option: any) => changeOptions(option.value, 'kathedra')}
							/>
						</>
					)}
				</div>
			</div>
			<div className={style.plotRow}>
				{statisticLoading ? (
					<div className={style.plotLoading}>
						<div className={style.plotLoadingHeader}>🕑 Обробка</div>
						<div className={style.plotLoadingDescription}>зачекайте, будь ласка</div>
					</div>
				) : (
					<div className={style.plotContainer}>
						{plot}
					</div>
				)}
			</div>
		</>
	)

	return (
		<div className={style.body}>
			<div className={style.mainContainer}>
				{ DataLoaded ? (
					<div className={style.contentContainer}>
						{content}
					</div>
				) : (
					<div className={style.noData}>
						<div className={style.noDataHeader}>💁‍♂️ Дані не завантажені</div>
						<div className={style.noDataDescription}>оберіть файл з даними статистики MIX формату .csv праворуч ➡️</div>
					</div>
				)}
			</div>
			<div className={style.sidebarContainer}>
				<div className={style.csvInputHeader}>
					Дані статистики
				</div>
				<div className={style.csvInputDescription}>
					Виберіть файл з даними статистики MIX формату .csv для відображення в застосунку
				</div>
				<div className={style.csvInputContainer}>
					<CSVReader
						cssClass={style.csvInput}
						inputId="csv-input"
						parserOptions={{ header: true }}
						onFileLoaded={handleLoad}
					/>
					{ DataLoaded ? (
						<div className={style.csvInputRemoveButton} onClick={() => removeFile()}>Очистити</div>
					) : (
						<div className={style.csvInputRemoveButtonDisabled} onClick={() => removeFile()}>Очистити</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default MixStaistic;