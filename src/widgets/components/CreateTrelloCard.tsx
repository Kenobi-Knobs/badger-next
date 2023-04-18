import { Trello } from "trello-for-wolves";
import React, { useEffect } from "react";
import style from '../styles/mixStatistic.module.css';
import Select from 'react-select';
import { toast } from "react-toastify";

export const CreateTrelloCard = (props: any) => {
	const [boards, setBoards] = React.useState([]);
	const [lists, setLists] = React.useState([]);
	const [board, setBoard] = React.useState('');
	const [list, setList] = React.useState({value: '', label: ''});
	const [cardName, setCardName] = React.useState('');
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

	const addCardToTrello = async () => {
		const response = await trello.cards().addCard({
			name: cardName,
			idList: list.value,
			defaultLabels: true,
			defaultLists: true,
			keepFromSource: "none",
		});
		const card = await response.json();
		const image = props.image();
		const responseImage = await trello.cards(card.id).attachments().uploadAttachment({
			file: image,
		});
		const imageResponse = await responseImage.json();

		if (card.id && imageResponse) {
			toast.success('Картка успішно створена', 
				{position: toast.POSITION.BOTTOM_CENTER, autoClose: 3000});
		} else {
			toast.error('Помилка при створенні картки', 
				{position: toast.POSITION.BOTTOM_CENTER, autoClose: 3000});
		}
		props.closeModal();
	};

	useEffect(() => {
		// temporary! need to get trello from server
		const trello = new Trello({
			key: props.trelloApiKey,
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
	}, [props.trelloKey, props.trelloApiKey]);

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
								setList({value: '', label: ''});
							}}
							className={style.selectSearchModal}
						/>
						{ board !== '' && (
							<>
								<div className={style.trelloSelectLabel}>
									Список
								</div>
								<Select
									value={list}
									options={lists.map((list: any) => ({value: list.id, label: list.name}))}
									onChange={(e: any) => {
										setList({value: e.value, label: e.label});
									}}
									className={style.selectSearchModal}
								/>
							</>
						)}
						{ list.value !== '' && (
							<>
								<div className={style.trelloSelectLabel}>
									Назва *
								</div>
								<input className={style.trelloInput} value={cardName} onChange={
									(e: any) => {
										setCardName(e.target.value);
									}
								}/>
								<div className={style.trelloDescription}>
									До картки буде додано сформований Графік
								</div>
								<div className={style.trelloButtonContainer}>
									{ cardName !== '' ? (
										<div className={style.addCardButton} onClick={() => addCardToTrello()}>Додати картку</div>
									) : (
										<div className={style.addCardButtonDisabled}>Додати картку</div>
									)}
								</div>
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