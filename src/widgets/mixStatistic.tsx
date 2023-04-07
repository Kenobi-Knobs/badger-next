import React, { CSSProperties, useEffect, useCallback } from 'react';
import CSVReader from 'react-csv-reader';
import style from './styles/mixStatistic.module.css';
import Dropdown from 'react-dropdown';
import 'react-dropdown/style.css';

const scopeOptions = [
	{ value: 'all', label: 'Університет' },
	{ value: 'facult', label: 'Факультети' },
	{ value: 'katedra', label: 'Кафедри' }
];

const MixStaistic = (props: any) => {
	const [data, setData] = React.useState<any>([]);
	const [DataLoaded, setDataLoaded] = React.useState<boolean>(false);
	const [statisticLoading, setStatisticLoading] = React.useState<boolean>(false);
	const [scope, setScope] = React.useState<string>('all');
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
	};

	const changeScope = (value: string) => {
		setScope(value);
		setStatisticLoading(true);
		if (value === 'all') {
			setPlot(getUniversityStatistic());
		} else {
			setPlot(<></>);
		}
		setStatisticLoading(false);
	};

	const getUniversityStatistic = useCallback(() => {
		let totalActivity = 0;
		let katedraList = [] as any;
		let facultList = [] as any;
		data.map((item: any) => {
			if (parseInt(item['Підсумок активностей'])) {
				totalActivity += parseInt(item['Підсумок активностей']);
			}
			if (item['code_div']) {
				if (!katedraList.includes(item['code_div'])) {
					katedraList.push(item['code_div']);
				}
				let facultId = item['code_div'].split('.')[0];
				if (!facultList.includes(facultId)) {
					facultList.push(facultId);
				}
			}
		});
		return (
			<div className={style.plotRowAll}>
				<div className={style.plotRowItemHeader}>Всього активностей</div>
				<div className={style.plotRowItemValue}>{totalActivity}</div>
				<div className={style.plotRowItemHeader}>Кількість кафедр</div>
				<div className={style.plotRowItemValue}>{katedraList.length}</div>
				<div className={style.plotRowItemHeader}>Кількість факультетів</div>
				<div className={style.plotRowItemValue}>{facultList.length}</div>
			</div>
		)
	}, [data]);

	useEffect(() => {
		if (DataLoaded) {
			setStatisticLoading(true);
			setPlot(getUniversityStatistic());
			setStatisticLoading(false);
		}
	}, [DataLoaded, getUniversityStatistic]);

	const content = (
		<>
			<div className={style.controlRow}>
				<div className={style.contentHeader}>Активності на платформі</div>
				<div className={style.contentDescription}>Керуйте параметрами відображення за допомогою налаштуваннь нижче</div>
				<div className={style.contentControlContainer}>
					<div className={style.controlDescription}>Вибірка:</div>
					<Dropdown
						options={scopeOptions}
						value={scopeOptions[0]}
						controlClassName={style.dropdown}
						menuClassName={style.dropdownMenu}
						onChange={(option: any) => changeScope(option.value)}
					/>
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