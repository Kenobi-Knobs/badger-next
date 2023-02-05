import Image from 'next/image';
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
					<Link href="/" className={`${ current == '/' 
						? styles.navigationMenuItem + ' ' + styles.active 
						: styles.navigationMenuItem}`}>
						<Image src='/home.svg' className={styles.navigationItemIcon} width={24} height={24} alt={'home'}/>
						<div className={styles.navigationMenuItemText}>Головна</div>
					</Link>
					<Link href="/market" className={`${ current == '/market' 
						? styles.navigationMenuItem + ' ' + styles.active 
						: styles.navigationMenuItem}`}>
						<Image src='/market.svg' className={styles.navigationItemIcon} width={24} height={24} alt={'market'}/>
						<div className={styles.navigationMenuItemText}>Застосунки</div>
					</Link>
					<Link href="/settings" className={`${ current == '/settings' 
						? styles.navigationMenuItem + ' ' + styles.active 
						: styles.navigationMenuItem}`}>
						<Image src='/settings.svg' className={styles.navigationItemIcon} width={24} height={24} alt={'settings'}/>
						<div className={styles.navigationMenuItemText}>Налаштування</div>
					</Link>
				</div>
			</div>
			<div className={styles.navigationFooter}>
				<div className={styles.navigationSocialLinkItem}>
					<Image src='/telegram-logo.svg' className={styles.navigationSocialLinkItemIcon} width={16} height={16} alt={'telegram'}/>
				</div>
				<div className={styles.navigationSocialLinkItem}>
					<Image src='/github-logo.svg' className={styles.navigationSocialLinkItemIcon} width={16} height={16} alt={'github'}/>
				</div>
			</div>
		</div>
	);
};

export default Navigation;