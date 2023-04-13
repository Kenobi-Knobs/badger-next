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

export const getTotalInteractions = (interactions: number[][]) => {
	let totalInteractions = [] as number[];
	for (let i = 0; i < interactionTypes.length; i++) {
		totalInteractions.push(0);
	}
	for (let i = 0; i < interactions.length; i++) {
		for (let j = 0; j < interactions[i].length; j++) {
			totalInteractions[j] += interactions[i][j];
		}
	}
	return totalInteractions;
};

export const getTotalInteractionsByKathedra = (data: any, kathedra: string) => {
	let interactions = [] as any[];
	interactionTypes.map((type: string) => {
		interactions.push(0);
	});

	data.map((item: any) => {
		if (item['code_div'] === kathedra) {
			for (let i = 0; i < interactionTypes.length; i++) {
				if (parseInt(item[interactionTypes[i]])) {
					interactions[i] += parseInt(item[interactionTypes[i]]);
				}
			}
		}
	});

	return interactions;
}

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

export const getKathedraOptions = (data: any, facult: string) => {
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


export const getInteractions = (data: any, type: string, dataSet: [], teacher = '') => {
	let interactions = [] as any[];
	if (type === 'facultet') {
		let facultetIds = getFacultetIds(data);
		facultetIds.map((facultetId: string) => {
			let facultetInteractions = getInteractionsByFacultet(data, facultetId);
			interactions.push(facultetInteractions);
		});
	} else if (type === 'kathedra') {
		dataSet.map((kathedra: any) => {
			let kathedraInteractions = getInteractionsByKathedra(data, kathedra);
			interactions.push(kathedraInteractions);
		});
	} else if (type === 'teacher') {
		dataSet.map((group: any) => {
			let groupInteractions = getGroupInteractions(data, group, teacher);
			interactions.push(groupInteractions);
		});
	}

	return interactions;
}

export const getGroupInteractions = (data: any, group: string, teacher: string) => {
	let interactions = [] as any[];
	interactionTypes.map((type: string) => {
		interactions.push(0);
	});

	data.map((item: any) => {
		if (item['tutors'] && item['tutors'].includes(teacher) && item['title'] === group) {
			for (let i = 0; i < interactionTypes.length; i++) {
				if (parseInt(item[interactionTypes[i]])) {
					interactions[i] += parseInt(item[interactionTypes[i]]);
				}
			}
		}
	});

	return interactions;
}

export const getInteractionsByKathedra = (data: any, id: string) => {
	let interactions = [] as any[];
	interactionTypes.map((type: string) => {
		interactions.push(0);
	});

	data.map((item: any) => {
		if (item['code_div']) {
			if (item['code_div'] === id) {
				for (let i = 0; i < interactionTypes.length; i++) {
					if (parseInt(item[interactionTypes[i]])) {
						interactions[i] += parseInt(item[interactionTypes[i]]);
					}
				}
			}
		}
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
 
export const getGroupNamesByTeacher = (data: any, teacher: string) => {
	let groups = [] as any[];
	data.map((item: any) => {
		if (item['tutors'] && item['tutors'].includes(teacher)) {

			if (!groups.some((group: any) => group === item['title'])) {
				groups.push(item['title']);
			}
		}
	});
	return groups;
}

export const getTeacherListByKathedra = (data: any, id: string) => {
	let teachers = [] as any[];
	data.map((item: any) => {
		if (item['code_div']) {
			if (item['code_div'] === id) {
				//get teachers from string {teacher, teacher1, teache2}
				let teacherList = item['tutors'].split(',');
				teacherList.map((teacher: string) => {
					//remove '{' and '}'
					teacher = teacher.replace('{', '');
					teacher = teacher.replace('}', '');
					//add teacher to array if not exist
					if (!teachers.some((item: any) => item.value === teacher)) {
						teachers.push({value: teacher, label: teacher});
					}
				});
			}
		}
	});
	return teachers;
}
