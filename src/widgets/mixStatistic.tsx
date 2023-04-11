import React, { CSSProperties, useEffect, useCallback, useRef } from 'react';
import CSVReader from 'react-csv-reader';
import style from './styles/mixStatistic.module.css';
import Dropdown from 'react-dropdown';
import Select from 'react-select';
import 'react-dropdown/style.css';
import BarChart from './components/BarChart';
import {
	facultyOptions,
	interactionTypes,
	getFacultiesNames,
	getInteractions,
	getKathedraOptions,
	getTeacherListByKathedra,
	getGroupNamesByTeacher
} from './utils/mixDataManager';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';

type Options = {
	facult: string;
	kathedra: string;
	teacher: string;
};

const MixStaistic = (props: any) => {
	const [data, setData] = React.useState<any>([]);
	const [DataLoaded, setDataLoaded] = React.useState<boolean>(false);
	const [statisticLoading, setStatisticLoading] = React.useState<boolean>(false);
	const [tab, setTab] = React.useState<string>('detail');
	const [options, setOptions] = React.useState<Options>(
		{
			facult: 'all',
			kathedra: 'all',
			teacher: '',
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
			teacher: '',
		});
	};

	const changeOptions = (value: string, input: string) => {
		if (input === 'facult') {
			setOptions({
				...options,
				kathedra: 'all',
				[input as keyof Options]: value
			});
		} else if (input === 'kathedra') {
			setOptions({
				...options,
				teacher: '',
				[input as keyof Options]: value
			});
		} else {
			setOptions({
				...options,
				[input as keyof Options]: value
			});
		}
	};

	const generatePlot = useCallback(() => {
		setStatisticLoading(true);
		if (options.facult == 'all' && options.kathedra == 'all') {
			const facultetNames = getFacultiesNames(data);
			const interactions = getInteractions(data, 'facultet', []);
			const plotData = {
				entities: facultetNames,
				interactions: interactions,
				interactionTypes: interactionTypes,
				rotate: 0,
			};
			setPlot(
				<>
					<BarChart data={plotData}/>
				</>
			);
		} else if (options.facult != 'all' && options.kathedra == 'all') {
			let kathedraNames = getKathedraOptions(data, options.facult).map((item: any) => item.label);
			kathedraNames.shift();
			const kathedraIds = getKathedraOptions(data, options.facult).map((item: any) => item.value) as [];
			kathedraIds.shift();
			if (kathedraIds.length == 0) {
				setPlot(
					<>
						<div className={style.noDataPlot}>
							<div className={style.noDataHeader}>🤷‍♂️ Немає даних</div>
							<div className={style.noDataDescription}>Для вибраного факультету немає даних</div>
						</div>
					</>
				);
				setStatisticLoading(false);
				return;
			}
			const interactions = getInteractions(data, 'kathedra', kathedraIds);
			const plotData = {
				entities: kathedraNames,
				interactions: interactions,
				interactionTypes: interactionTypes,
				rotate: 0,
			};
			setPlot(
				<>
					<BarChart data={plotData}/>
				</>
			);
		} else if (options.facult != 'all' && options.kathedra != 'all' && options.teacher == '') {
			setPlot(
				<>
					<div className={style.noDataPlot}>
						<div className={style.noDataHeader}>✍️ Оберіть викладача</div>
						<div className={style.noDataDescription}>Оберіть викладача по якому потрібно отримати дані для відображення</div>
					</div>
				</>
			);
		} else if (options.teacher != '') {
			const groupNames = getGroupNamesByTeacher(data, options.teacher) as [];
			const interactions = getInteractions(data, 'teacher', groupNames, options.teacher);
			let rotate = 0;
			if (groupNames.length > 10) {
				rotate = 90;
			}
			const plotData = {
				entities: groupNames,
				interactions: interactions,
				interactionTypes: interactionTypes,
				rotate: rotate,
			};
			setPlot(
				<>
					<BarChart data={plotData}/>
				</>
			);
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
								options={getKathedraOptions(data, options.facult)}
								value={options.kathedra}
								controlClassName={style.dropdown}
								menuClassName={style.dropdownMenu}
								onChange={(option: any) => changeOptions(option.value, 'kathedra')}
							/>
						</>
					)}
					{options.kathedra !== 'all' && (
						<>
						<div className={style.controlDescription}>Викладач:</div>
						<Select
							options={getTeacherListByKathedra(data, options.kathedra)}
							value={{value: options.teacher, label: options.teacher}}
							onChange={(option: any) => changeOptions(option.value, 'teacher')}
							isSearchable={true}
							className={style.selectSearch}
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
					<>
						<Tabs
							classes={{indicator: style.tabsIndicator}}
							value={tab}
							onChange={(event: React.SyntheticEvent, newValue: string) => setTab(newValue)}
							className={style.tabs}
							>
							<Tab
								classes = {{root: style.tab, selected: style.tabSelected}}
								value='detail'
								label='Детально'
							/>
							<Tab
								classes = {{root: style.tab, selected: style.tabSelected}}
								value='total'
								label='Загально'
							/>
						</Tabs>
						<div className={style.plotContainer}>
							{tab === 'total' ? (
								<div className={style.totalContainer}>
									<div className={style.totalHeader}>Всього активностей:</div>
								</div>
							) : (
								<>
									{plot}
								</>
							)}
						</div>
					</>
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