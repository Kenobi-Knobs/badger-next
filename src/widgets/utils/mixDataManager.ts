export const facultyOptions = [
	{ value: 'all', label: 'Всі' },
	{ value: '52', label: 'ЕлІТ' },
	{ value: '54', label: 'ІФСК' },
	{ value: '60', label: 'НН МІ' },
	{ value: '53', label: 'ННІ БіЕМ' },
	{ value: '55', label: 'ННІ Права' },
	{ value: '51', label: 'ТеСЕТ' },
	{ value: '80', label: 'ШІ СумДУ' },
	{ value: '35', label: 'КІ СумДУ' }
];

export const interactionTypes = [
	'Оцнювання роботи в класі',
	'Взаємне оцінювання',
	'Письмові звіти',
	'Оцінювання студентських робіт',
	'Інтерактивні тренажери',
	'Тестування',
	'Робота із Wiki',
	'Коментары в письмових роботах',
	'Повідомлення в обговореннях',
	'Оцінка повідомлень в обговореннях'
];

export const getFacultetIds = (data: any) => {
	// get all uniq faculties id from data
	let facultetIds = [] as string[];
	data.map((item: any) => {
		if (item['code_div']) {
			let facultId = item['code_div'].split('.')[0];
			if (!facultetIds.some((facultet: any) => facultet === facultId)) {
				facultetIds.push(facultId);
			}
		}
	});
	return facultetIds;
};

export const getFacultiesNames = (data: any) => {
	let facultetIds = getFacultetIds(data);
	// generate array of faculties names from faculties ids using facultyOptions
	let facultetNames = [] as string[];
	facultetIds.map((facultetId: string) => {
		let facultetName = facultyOptions.find((option: any) => option.value === facultetId);
		if (facultetName) {
			facultetNames.push(facultetName.label);
		}
	});

	return facultetNames;
};

export const getInteractions = (data: any, type: string) => {

	let facultetIds = getFacultetIds(data);
	
	let interactions = [] as any[];
	facultetIds.map((facultetId: string) => {
		let facultetInteractions = getInteractionsByFacultet(data, facultetId);
		interactions.push(facultetInteractions);
	});

	return interactions;
}

export const getInteractionsByFacultet = (data: any, id: string) => {
	let interactions = [] as any[];
	interactionTypes.map((type: string) => {
		interactions.push(0);
	});

	data.map((item: any) => {
		if (item['code_div']){
			let facultetId = item['code_div'].split('.')[0];
			if (facultetId === id) {
				for (let i = 0; i < interactionTypes.length; i++) {
					if (parseInt(item[interactionTypes[i]])){
						interactions[i] += parseInt(item[interactionTypes[i]]);
					}
				}
			}
		}
	});

	return interactions;
}


