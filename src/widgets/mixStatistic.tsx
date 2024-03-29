﻿import React, { CSSProperties, useEffect, useCallback, useRef } from 'react';
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
	getGroupNamesByTeacher,
	getTotalInteractions,
	getTotalInteractionsByKathedra,
} from './utils/mixDataManager';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import { toast } from 'react-toastify';

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
	const [fileName, setFileName] = React.useState<string>('');
	const [loadedFromStorage, setLoadedFromStorage] = React.useState<boolean>(false);
	const [options, setOptions] = React.useState<Options>(
		{
			facult: 'all',
			kathedra: 'all',
			teacher: '',
		}
	);
	const [plot , setPlot] = React.useState<any>(<></>);
	const [total, setTotal] = React.useState<any>(<></>);
	const [trelloKey, setTrelloKey] = React.useState<string>('');
	const [trelloApiKey, setTrelloApiKey] = React.useState<string>('');

	const saveState = (remove: boolean) => {
		if (remove) {
			localStorage.removeItem('mixStatistic');
			toast.success('Дані видалено', {
				position: 'bottom-center'
			});
			return;
		} else {
			const state = {
				data: data,
				options: options,
				fileName: fileName,
				trelloKey: trelloKey,
				trelloApiKey: trelloApiKey,
			};
			localStorage.setItem('mixStatistic', JSON.stringify(state));
			toast.success('Дані збережено', {
				position: 'bottom-center'
			});
		}
	};

	const loadState = () => {
		const state = JSON.parse(localStorage.getItem('mixStatistic') as string);
		if (state) {
			setFileName(state.fileName);
			setData(state.data);
			setOptions(state.options);
			setTrelloKey(state.trelloKey);
			setTrelloApiKey(state.trelloApiKey);
			setDataLoaded(true);
			setLoadedFromStorage(true);
		}
	};

	const handleLoad = (data: any, fileInfo: any) => {
		setFileName(fileInfo.name);
		setData(data);
		setDataLoaded(true);
	};

	const removeFile = () => {
		saveState(true);
		setLoadedFromStorage(false)
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
			let totalInteractions = getTotalInteractions(interactions);
			setTotal(
				<div className={style.total}>
					<div className={style.totalHeader}>Всього по університету:</div>
					{interactionTypes.map((item: any, index: number) => {
						return (
							<div className={style.totalItem} key={index}>
								<div className={style.totalItemName}>{item}:</div>
								<div className={style.totalItemValue}>{totalInteractions[index]}</div>
							</div>
						);
					})
					}
				</div>
			);
			setPlot(
				<>
					<BarChart data={plotData} trelloKey={trelloKey} trelloApiKey={trelloApiKey}/>
				</>
			);
		} else if (options.facult != 'all' && options.kathedra == 'all') {
			let kathedraNames = getKathedraOptions(data, options.facult).map((item: any) => item.label);
			kathedraNames.shift();
			const kathedraIds = getKathedraOptions(data, options.facult).map((item: any) => item.value) as [];
			kathedraIds.shift();
			if (kathedraIds.length == 0) {
				setTotal(
					<>
						<div className={style.noDataPlot}>
							<div className={style.noDataHeader}>🤷‍♂️ Немає даних</div>
							<div className={style.noDataDescription}>Для вибраного факультету немає даних</div>
						</div>
					</>
				);
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
			let totalInteractions = getTotalInteractions(interactions);
			setTotal(
				<div className={style.total}>
					<div className={style.totalHeader}>Всього по факультету:</div>
					{interactionTypes.map((item: any, index: number) => {
						return (
							<div className={style.totalItem} key={index}>
								<div className={style.totalItemName}>{item}:</div>
								<div className={style.totalItemValue}>{totalInteractions[index]}</div>
							</div>
						);
					})
					}
				</div>
			);
			setPlot(
				<>
					<BarChart data={plotData} trelloKey={trelloKey} trelloApiKey={trelloApiKey}/>
				</>
			);
		} else if (options.facult != 'all' && options.kathedra != 'all' && options.teacher == '') {
			const totalInteractions = getTotalInteractionsByKathedra(data, options.kathedra);
			setTotal(
				<div className={style.total}>
					<div className={style.totalHeader}>Всього по факультету:</div>
					{interactionTypes.map((item: any, index: number) => {
						return (
							<div className={style.totalItem} key={index}>
								<div className={style.totalItemName}>{item}:</div>
								<div className={style.totalItemValue}>{totalInteractions[index]}</div>
							</div>
						);
					})
					}
				</div>
			);
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
			let totalInteractions = getTotalInteractions(interactions);
			setTotal(
				<div className={style.total}>
					<div className={style.totalHeader}>Всього по викладачу:</div>
					{interactionTypes.map((item: any, index: number) => {
						return (
							<div className={style.totalItem} key={index}>
								<div className={style.totalItemName}>{item}:</div>
								<div className={style.totalItemValue}>{totalInteractions[index]}</div>
							</div>
						);
					})
					}
				</div>
			);
			setPlot(
				<>
					<BarChart data={plotData} trelloKey={trelloKey} trelloApiKey={trelloApiKey}/>
				</>
			);
		}

		setStatisticLoading(false);
	}, [options, data, trelloKey, trelloApiKey]);

	useEffect(() => {
		generatePlot();
	}, [generatePlot]);

	useEffect(() => {
		loadState();
	}, []);

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
							TabIndicatorProps={{
								title: 'indicator',
								sx: { backgroundColor: '#7f7f7f' }
							}}
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
								<>
									{total}
								</>
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
				<div className={style.SettingItem}>
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
						{ (fileName !== '' && loadedFromStorage) && (
							<div className={style.csvInputFileName}>Файл {fileName} завантажено з сховища</div>
						)}
						{ DataLoaded ? (
							<div className={style.csvInputRemoveButton} onClick={() => removeFile()}>Очистити</div>
						) : (
							<div className={style.csvInputRemoveButtonDisabled} onClick={() => removeFile()}>Очистити</div>
						)}
					</div>
				</div>
				<div className={style.SettingItem}>
					<div className={style.csvInputHeader}>
						Trello
					</div>
					<div className={style.csvInputDescription}>
						Для експорту в Trello додайте <a href='https://trello.com/power-ups/admin'>Ключ API</a> додатка:
					</div>
					<div className={style.csvInputContainer}>
						<input
							className={style.csvInput}
							type='text'
							value={trelloApiKey}
							onChange={(e) => setTrelloApiKey(e.target.value)}
						/>
					</div>
					<div className={style.csvInputDescription}>
						А також ключ авторизації:
					</div>
					<div className={style.csvInputContainer}>
						<input
							className={style.csvInput}
							type='text'
							value={trelloKey}
							onChange={(e) => setTrelloKey(e.target.value)}
						/>
					</div>
				</div>
				<div className={style.SettingItem}>
					<div className={style.csvInputHeader}>
						Збереження
					</div>
					<div className={style.csvInputDescription}>
							Вибрані дані буде збережено для наступного відкриття застосунку
					</div>
					<div className={style.settingBottomRow}>
						{ data.length > 0 ? (
							<div className={style.saveButton} onClick={() => saveState(false)}>Зберегти</div>
						) : (
							<div className={style.saveButtonDisabled}>Зберегти</div>
						)}
					</div>
				</div>
			</div>
		</div>
	);
};

export default MixStaistic;