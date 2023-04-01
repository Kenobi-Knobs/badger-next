import { ReactElement, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import type { NextPageWithLayout } from './_app'
import styles from '../styles/Market.module.css'
import Image from 'next/image'
import { useState } from 'react'
import WidgetMarketPreview from '@/components/WidgetMarketPreview'
import LoadingView from '@/components/LoadingView'

const Market: NextPageWithLayout = () => {
	const [widgets , setWidgets] = useState<any[]>([]);
	const [userWidgets , setUserWidgets] = useState<any[]>([]);
	const [loading , setLoading] = useState(false);

	const getWidgets = async () => {
		setLoading(true);
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
		setLoading(false);
	}

	useEffect(() => {
		getWidgets();
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
						<input type="text" placeholder={'Пошук'} className={styles.searchInput}/>
					</div>
					<div className={styles.widgetsContainer}>
						{widgets.map((widget) => (
							<WidgetMarketPreview key={widget.id} widget={widget} userWidgets={userWidgets}/>
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
