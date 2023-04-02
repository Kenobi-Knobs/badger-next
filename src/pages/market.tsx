import { ReactElement, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import type { NextPageWithLayout } from './_app'
import styles from '../styles/Market.module.css'
import Image from 'next/image'
import { useState } from 'react'
import WidgetMarketPreview from '@/components/WidgetMarketPreview'
import LoadingView from '@/components/LoadingView'
import { toast } from "react-toastify";

const Market: NextPageWithLayout = () => {
	const [widgets , setWidgets] = useState<any[]>([]);
	const [userWidgets , setUserWidgets] = useState<any[]>([]);
	const [loading , setLoading] = useState(false);

	const addWidget = async (id: string) => {
		const res = await fetch('/api/addWidget', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({id})
		});
		const data = await res.json();
		if (data.error) {
			toast.error(data.error);
			return;
		}
		const updateUserWidgets = userWidgets;
		updateUserWidgets.push(id);
		setUserWidgets(updateUserWidgets);
		getWidgets(false);
	}

	const getWidgets = async (load: boolean) => {
		if (load) {
			setLoading(true);
		}
		const res = await fetch('/api/getWidgetsMarketPreview', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		});
		const data = await res.json();
		setWidgets(data.widgets);

		const user = await fetch('/api/getUser', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		});
		const userData = await user.json();
		if (userData.user.widgets && userData.user.widgets.length != 0) {
			setUserWidgets(userData.user.widgets);
		}
		if (load) {
			setLoading(false);
		}
	}

	const setFilter = () => {
		const input = document.querySelector('input') as HTMLInputElement;
		let filterText = input.value
		if (filterText === '') {
			getWidgets(false);
			return;
		}

		const filteredWidgets = widgets.filter((widget) => {
			const name = widget.name.toLowerCase();
			const description = widget.description.toLowerCase();
			filterText = filterText.toLowerCase();
			if (name.includes(filterText) || description.includes(filterText)) {
				return true;
			}
			return false;
		})

		setWidgets(filteredWidgets);
	}

	useEffect(() => {
		getWidgets(true);
	} ,[])

	if (status === 'loading' || loading) {
		return <LoadingView />
	} else {
		return (
			<>
				<div className={styles.container}>
					<div className={styles.header}>Доступні додатки 🔥</div>
					<div className={styles.searchContainer}>
						<Image src='/search.svg' width={16} height={16} alt={'search'} className={styles.searchIcon}/>
						<input type="text" placeholder={'Пошук'} className={styles.searchInput} onChange={() => setFilter()}/>
					</div>
					<div className={styles.widgetsContainer}>
						{widgets.map((widget) => (
							<WidgetMarketPreview key={widget._id.toString()} widget={widget} userWidgets={userWidgets} addWidget={addWidget}/>
						))}
					</div>
				</div>
			</>
		)
	}
}


Market.getLayout = function getLayout(page: ReactElement) {
	return (
		<>
			<AppLayout>
				{page}
			</AppLayout>
		</>
	)
}

export default Market
