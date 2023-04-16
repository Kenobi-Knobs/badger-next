import { Trello } from "trello-for-wolves";
import React, { useEffect } from "react";
import style from '../styles/mixStatistic.module.css';
import Dropdown from 'react-dropdown';
import Select from 'react-select';

export const CreateTrelloCard = (props: any) => {
	const [boards, setBoards] = React.useState([]);
	const [lists, setLists] = React.useState([]);
	const [board, setBoard] = React.useState('');
	const [list, setList] = React.useState('');
	const [error, setError] = React.useState(false);
	const [trello, setTrello] = React.useState<any>(null);

	const getLists = async (boardId: string) => {
		const response = await trello.boards(boardId).lists().getLists();
		const lists = await response.json();
		setLists(lists);
	};

	const changeBoard = (boardId: string) => {
		getLists(boardId);
		setBoard(boardId);
	};

	useEffect(() => {
		// temporary! need to get trello from server
		const trello = new Trello({
			key: 'a7b91a6749d2193c741e222540ce2279',
			token: props.trelloKey,
		});
		trello.members('me').boards().getBoards()
			.then(response => response.json())
			.then(result => {
				setBoards(result as any);
				setTrello(trello);
			})
			.catch(error => {
				setError(true);
			});
	}, [props.trelloKey]);

	return (
		<>
			{props.trelloKey !== '' && !error ? (
				<div>
					<div className={style.trelloSelect}>
						<div className={style.trelloSelectLabel}>
							Дошка
						</div>
						<Select 
							options={boards.map((board: any) => ({value: board.id, label: board.name}))}
							onChange={(e: any) => {
								changeBoard(e.value);
							}}
						/>
						{ board !== '' && (
							<>
								<div className={style.trelloSelectLabel}>
									Список
								</div>
								<Select
									options={lists.map((list: any) => ({value: list.id, label: list.name}))}
									onChange={(e: any) => {
										setList(e.value);
									}}
								/>
							</>
						)}
						{ list !== '' && (
							<>
								Картка
							</>
						)}
					</div>
				</div>
			) : (
				<div className={style.noKey}>
					🤷‍♂️ Немає ключа або він не коректний, додайте його в налаштуваннях віджету
				</div>
			)}
		</>
	);
}

export default CreateTrelloCard;