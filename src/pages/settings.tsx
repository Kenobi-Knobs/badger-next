import { ReactElement, useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import type { NextPageWithLayout } from './_app'
import WidgetLayout from '../components/WidgetLayout'
import styles from '../styles/Settings.module.css'
import LoadingView from '@/components/LoadingView'
import Image from 'next/image'

export async function getStaticProps() {
	return { props: { title: 'Налаштування ⚙️'}}
}

const Settings: NextPageWithLayout = () => {
	const [user, setUser] = useState<any>(null);
	const [loading , setLoading] = useState(false);

	const getUsingDayCount = (registeredAt: string) => {
		const date = new Date(registeredAt);
		const today = new Date();
		const diffTime = Math.abs(today.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	const getUserinfo = async () => {
		setLoading(true);
		const res = await fetch('/api/getUser', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		});
		const data = await res.json();
		setUser(data.user);
		setLoading(false);
	}

	useEffect(() => {
		getUserinfo();
	} ,[])


	if (loading) {
		return <LoadingView />
	} else {
		return (
			<>
				<div className={styles.headerContainer}>
					<div className={styles.userProfile}>
						<Image 
							src={user?.image || '/userpic.png'}
							width={80}
							height={80}
							alt="User avatar"
							className={styles.avatar}
						/>
						<div className={styles.userNameContainer}>
							<div className={styles.userFullName}>{user?.name || ''}</div>
							<div className={styles.userName}>{'@' + user?.username || ''}</div>
						</div>
					</div>
					<div className={styles.headerStatistics}>
						<div className={styles.statistic}>Днів користування: {getUsingDayCount(user?.registeredAt)}</div>
					</div>
				</div>
			</>
		)
	}
}

Settings.getLayout = function getLayout(settings: ReactElement) {
	return (
		<>
			<AppLayout>
				<WidgetLayout>
					{settings}
				</WidgetLayout>
			</AppLayout>
		</>
	)
}

export default Settings