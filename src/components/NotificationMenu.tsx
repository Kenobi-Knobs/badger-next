﻿import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/NotificationMenu.module.css'
import Link from 'next/link'
import Image from 'next/image';

const ProfileMenu = (props: any) => {
	const [notificationsOpen, setNotificationOpen] = useState(false);
	const [indication, setIndication] = useState(false);
	const [notifications, setNotifications] = useState<any[]>([]);
	const menu = useRef<any>(null);

	const getNotifications = async () => {
		const res = await fetch('/api/getNotifications?week=true', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		});
		const data = await res.json();
		setNotifications(data.notifications);
		const unread = data.notifications.filter((notification: any) => !notification.read);
		if (unread.length > 0) setIndication(true);
	}

	const openNotification = () => {
		if (!notificationsOpen) {
			getNotifications();
			markNotificationsAsRead();
			setNotificationOpen(true);
		} else {
			setNotificationOpen(false);
		}
	}

	const markNotificationsAsRead = async () => {
		const unreadNotifications = notifications.filter((notification: any) => !notification.read);
		if (unreadNotifications.length === 0) return;
		const notificationIds = unreadNotifications.map((notification: any) => notification._id);

		await fetch('/api/readNotifications', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({ readNotifications: notificationIds })
		});

		setIndication(false);
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

	const formatDate = (date: string) => {
		const d = new Date(date);
		const hours = d.getHours() < 10 ? '0' + d.getHours() : d.getHours();
		const minutes = d.getMinutes() < 10 ? '0' + d.getMinutes() : d.getMinutes();
		const day = d.getDate() < 10 ? '0' + d.getDate() : d.getDate();
		const correctMonth = d.getMonth() + 1;
		const month = correctMonth < 10 ? '0' + correctMonth: correctMonth;
		return `${hours}:${minutes} ${day}/${month}`;
	}

	useEffect(() => {
		if (!notificationsOpen) return;
		const handleClickOutside = (event: any) => {
			if (menu.current && !menu.current.contains(event.target)) {
				if (event.target.className !== styles.notificationClose && event.target.className !== styles.notificationCloseIcon) {
						setNotificationOpen(false);
				}
			}
		}
		window.addEventListener("click", handleClickOutside);
		return () => {
			window.removeEventListener("click", handleClickOutside);
		}
	}, [notificationsOpen]);

	useEffect(() => {
		getNotifications();
		const interval = setInterval(() => {
			getNotifications();
		}, 60000);
		return () => clearInterval(interval);
	}, []);

	return (
		<div ref={menu}>
			<div className={styles.notificationButton} onClick={() => {openNotification()}}>
				<Image src='/bell.svg' width={15} height={15} alt={'notification'} />
				{indication && <div className={styles.indication}></div>}
			</div>
			{notificationsOpen && <div className={styles.notificationContainer}>
				{notifications.length > 0 && notifications.map((notification, index) => {
					return (
						<div key={notification._id} className={styles.notification}>
							<div className={styles.notificationTopContainer}>
								<div className={styles.notificationTitle}>
									{notification.messageTitle}
									{!notification.read && <div className={styles.unreadIndication}></div>}
								</div>
								<div className={styles.notificationClose} onClick={async () => {
									deleteNotification(notification._id);
									setNotifications(notifications.filter((n, i) => i !== index))
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
				{notifications.length === 0 && <div className={styles.noNotifications}>Немає сповіщень 🤷‍♂️</div>}
				<div className={styles.archiveLink}>
					<Link href='/notificationsArchive' className={styles.link} onClick={() => setNotificationOpen(false)}>Архів сповіщеннь</Link>
				</div>
			</div>}
		</div>
	);
};

export default ProfileMenu;