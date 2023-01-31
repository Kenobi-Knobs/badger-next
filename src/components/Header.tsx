import styles from '../styles/Header.module.css'
import ProfileMenu from './ProfileMenu'
import NotificationMenu from './NotificationMenu'

const Header = (props: any) => {
	const { session, handleLogout, welcome } = props;
	let welcomeText = '';

	if (welcome) {
		welcomeText = `Вітаємо, ${session.user?.name?.split(' ')[0]} 👋`;
	}

	return (
		<div className={styles.headerContainer}>
			<div className={styles.welcomeText}>{welcomeText}</div>
			<div className={styles.controlsContainer}>
				<NotificationMenu></NotificationMenu>
				<ProfileMenu
					user = {session.user}
					handleLogout = {handleLogout}
				></ProfileMenu>
			</div>
		</div>
	)
}

export default Header