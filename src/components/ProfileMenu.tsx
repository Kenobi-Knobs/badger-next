﻿import React from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/ProfileMenu.module.css'

const ProfileMenu = (props: any) => {
	const { user, handleLogout } = props;
	const [menuOpen, setMenuOpen] = useState(false);
	const menu = useRef<any>(null);

	useEffect(() => {
		if (!menuOpen) return;

		const handleClickOutside = (event: any) => {
			console.log(menu.current.contains(event.target));
			if (menu.current && !menu.current.contains(event.target)) {
				setMenuOpen(false);
			}
		}
		window.addEventListener("click", handleClickOutside);
		return () => window.removeEventListener("click", handleClickOutside);
	}, [menuOpen]);

	return (
		<div className={styles.userContainer} ref={menu}>
			<div className={styles.userImageContainer}>
				<img className={styles.userImage} src={user.image} onClick={() => setMenuOpen(b => !b)}/>
			</div>
			{menuOpen && <div className={styles.menuContainer}>
				<div className={styles.menuItem} onClick={() => handleLogout()}>
					<div className={styles.menuItemText}>Вихід</div>
					<img className={styles.menuItemIcon} src="/log-out.svg"/>
				</div>
			</div>}
		</div>
	);
};

export default ProfileMenu;