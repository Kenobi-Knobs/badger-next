import { ReactElement, useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import type { NextPageWithLayout } from './_app'
import WidgetLayout from '../components/WidgetLayout'
import styles from '../styles/NotificationsArchive.module.css'
import LoadingView from '@/components/LoadingView'
import Image from 'next/image'

export async function getStaticProps() {
	return { props: { title: 'Архів сповіщеннь ✉️'}}
}

const NotificationsArchive: NextPageWithLayout = () => {
	const [loading , setLoading] = useState(false);
	const [notifications , setNotifications] = useState<any[]>([]);
	const [showNotifications , setShowNotifications] = useState<any[]>([]);
	
	useEffect(() => {
		getNotifications(true);
	} ,[])

	const getNotifications = async (load: boolean) => {
		if (load) setLoading(true);
		const res = await fetch('/api/getNotifications', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		});
		const data = await res.json();
		const sortedNotifications = data.notifications.sort((a: any, b: any) => {
			return new Date(b.date).getTime() - new Date(a.date).getTime();
		});
		setNotifications(sortedNotifications);
		setShowNotifications(sortedNotifications);
		if (load) setLoading(false);
	}

	const formatDate = (date: string) => {
		const d = new Date(date);
		const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
		const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
		const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
		const correctMonth = d.getMonth() + 1;
		const month = correctMonth < 10 ? '0' + correctMonth: correctMonth;
		return `${hours}:${minutes} ${day}/${month}`;
	}

	const deleteNotification = async (id: string) => {
		await fetch('/api/deleteNotification', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({ notificationId: id })
		});
	}

	const setFilter = () => {
		const input = document.querySelector('input') as HTMLInputElement;
		let filterText = input.value
		if (filterText === '') {
			getNotifications(false);
			return;
		}
		const filteredNotifications = notifications.filter((notification) => {
			let messageTitle = notification.messageTitle.toLowerCase();
			let message = notification.messageText.toLowerCase();
			let date = formatDate(notification.date);

			filterText = filterText.toLowerCase();

			return (messageTitle.includes(filterText) || message.includes(filterText) || date.includes(filterText));
		});
		setShowNotifications(filteredNotifications);
	}

	if (loading) {
		return <LoadingView />
	} else {
		return (
			<div className={styles.notificationsContainer}>
				<div className={styles.searchContainer}>
					<Image src='/search.svg' width={16} height={16} alt={'search'} className={styles.searchIcon}/>
					<input type="text" placeholder={'Пошук'} className={styles.searchInput} onChange={() => setFilter()}/>
				</div>
				<div className={styles.notificationsList}>
					{showNotifications.length > 0 && showNotifications.map((notification, index) => {
						return (
							<div key={notification._id} className={styles.notification}>
								<div className={styles.notificationTopContainer}>
									<div className={styles.notificationTitle}>
										{notification.messageTitle}
									</div>
									<div className={styles.notificationClose} onClick={async () => {
										deleteNotification(notification._id);
										setNotifications(notifications.filter((n, i) => i !== index));
										setShowNotifications(showNotifications.filter((n, i) => i !== index));
									}}>
									<Image src='/close.svg' width={6} height={6} alt={'close'} />
									</div>
								</div>
								<div className={styles.notificationBottomContainer}>
									<div className={styles.notificationText}>{notification.messageText}</div>
									<div className={styles.notificationDate}>{formatDate(notification.date)}</div>
								</div>
							</div>
						);
					})}
				</div>
			</div>
		)
	}
}

NotificationsArchive.getLayout = function getLayout(notificationsArchive: ReactElement) {
	return (
		<>
			<AppLayout>
				<WidgetLayout>
					{notificationsArchive}
				</WidgetLayout>
			</AppLayout>
		</>
	)
}

export default NotificationsArchive