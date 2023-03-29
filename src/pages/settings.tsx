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
							<div className = {styles.topContainer}>
								<div className={styles.userFullName}>{user?.name || ''}</div>
								{user?.role === 'admin' && <div className={styles.adminBadge}>admin</div>}
							</div>
							<div className={styles.userName}>{'@' + user?.username || ''}</div>
						</div>
					</div>
					<div className={styles.headerStatistics}>
						<div className={styles.statistic}>Днів користування: {getUsingDayCount(user?.registeredAt)}</div>
					</div>
				</div>
				<div className={styles.settingsContainer}>
					<div>
						<div className={styles.settingComponent}>
							<div className={styles.settingLeftBlock}>
								<div className={styles.settingName}>Скидання віджетів</div>
								<div className={styles.settingDescription}>Це скине всі віджети до початкового стану</div>
							</div>
							<button className={styles.settingButton}>Скинути</button>
						</div>
						<div className={styles.settingComponent}>
							<div className={styles.settingLeftBlock}>
								<div className={styles.settingName}>Сповіщення</div>
								<div className={styles.settingDescription}>Якщо вимкнути сповіщення ви не будете отримувати повідомлення від сервісу чи користувачів</div>
							</div>
							<button className={styles.settingButton}>Вимкнути</button>
						</div>
					</div>
					<div>
						{user?.role === 'admin' &&
							<p>Зареструвати віджет</p>
						}
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