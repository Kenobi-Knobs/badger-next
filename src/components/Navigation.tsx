import Link from 'next/link';
import React from 'react';
import styles from '../styles/Navigation.module.css'

const Navigation = (props: any) => {
	const { current } = props;

	return (
		<div className={styles.navigationContainer}>
			<div className={styles.navigationHeader}>
				<div className={styles.logo}>Logo</div>
				<div className={styles.navigationMenu}>
					<Link href="/" className={`${ current == 'home' 
						? styles.navigationMenuItem + ' ' + styles.active 
						: styles.navigationMenuItem}`}>
						<img src='/home.svg' className={styles.navigationItemIcon}></img>
						<div className={styles.navigationMenuItemText}>Головна</div>
					</Link>
					<Link href="/market" className={`${ current == 'market' 
						? styles.navigationMenuItem + ' ' + styles.active 
						: styles.navigationMenuItem}`}>
						<img src='/market.svg' className={styles.navigationItemIcon}></img>
						<div className={styles.navigationMenuItemText}>Застосунки</div>
					</Link>
					<Link href="/settings" className={`${ current == 'settings' 
						? styles.navigationMenuItem + ' ' + styles.active 
						: styles.navigationMenuItem}`}>
						<img src='/settings.svg' className={styles.navigationItemIcon}></img>
						<div className={styles.navigationMenuItemText}>Налаштування</div>
					</Link>
				</div>
			</div>
			<div className={styles.navigationFooter}>
				<div className={styles.navigationSocialLinkItem}>
					<img src='/telegram-logo.svg' className={styles.navigationSocialLinkItemIcon}></img>
				</div>
				<div className={styles.navigationSocialLinkItem}>
					<img src='/github-logo.svg' className={styles.navigationSocialLinkItemIcon}></img>
				</div>
			</div>
		</div>
	);
};

export default Navigation;