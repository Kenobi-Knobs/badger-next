import React, { Component } from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/NotificationMenu.module.css'

const ProfileMenu = (props: any) => {
	const [notificationsOpen, setNotificationOpen] = useState(false);
	const [indication, setIndication] = useState(false);
	const [notifications, setNotifications] = useState<any[]>([]);
	const menu = useRef<any>(null);

	useEffect(() => {
		if (!notificationsOpen) return;
		const handleClickOutside = (event: any) => {
			if (menu.current && !menu.current.contains(event.target)) {
				setNotificationOpen(false);
			}
		}
		window.addEventListener("click", handleClickOutside);
		return () => window.removeEventListener("click", handleClickOutside);
	}, [notificationsOpen]);

	return (
		<div ref={menu}>
			<div className={styles.notificationButton} onClick={() => setNotificationOpen(!notificationsOpen)}>
				<img src='/bell.svg'/>
				{indication && <div className={styles.indication}></div>}
			</div>
			{notificationsOpen && <div className={styles.notificationContainer}>
				{notifications.length === 0 && <div className={styles.noNotifications}>Немає сповіщень 🤷‍♂️</div>}
			</div>}
		</div>
	);
};

export default ProfileMenu;