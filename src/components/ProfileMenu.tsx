import Image from 'next/image';
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import styles from '../styles/ProfileMenu.module.css'

const ProfileMenu = (props: any) => {
	const { user, handleLogout } = props;
	const [menuOpen, setMenuOpen] = useState(false);
	const menu = useRef<any>(null);

	useEffect(() => {
		if (!menuOpen) return;

		const handleClickOutside = (event: any) => {
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
				<Image 
					className={styles.userImage}
					src={user.image}
					alt="user image"
					width={40}
					height={40}
					onClick={() => setMenuOpen(b => !b)}
				/>
			</div>
			{menuOpen && <div className={styles.menuContainer}>
				<div className={styles.menuItem} onClick={() => handleLogout()}>
					<div className={styles.menuItemText}>Вихід</div>
					<Image
						className={styles.menuItemIcon}
						src="/log-out.svg"
						alt="log out icon"
						width={20}
						height={20}
					/>
				</div>
			</div>}
		</div>
	);
};

export default ProfileMenu;