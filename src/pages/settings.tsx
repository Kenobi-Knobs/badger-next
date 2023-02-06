import { ReactElement } from 'react'
import AppLayout from '../components/AppLayout'
import type { NextPageWithLayout } from './_app'
import WidgetLayout from '../components/WidgetLayout'
import styles from '../styles/Settings.module.css'
import { useSession } from 'next-auth/react'
import LoadingView from '@/components/LoadingView'
import Image from 'next/image'

export async function getStaticProps() {
	return { props: { title: 'Налаштування ⚙️'}}
}

const Settings: NextPageWithLayout = () => {
	const { data: session, status } = useSession()

	if (status === 'loading') {
		return <LoadingView />
	} else {
		return (
			<>
				<div className={styles.headerContainer}>
					<div className={styles.userProfile}>
						<Image 
							src={session?.user?.image || '/userpic.png'}
							width={80}
							height={80}
							alt="User avatar"
							className={styles.avatar}
						/>
						<div className={styles.userNameContainer}>
							<div className={styles.userFullName}>{session?.user?.name}</div>
							<div className={styles.userName}>@usermane</div>
						</div>
					</div>
					<div className={styles.headerStatistics}>
						<div className={styles.statistic}>Чогось: 0</div>
						<div className={styles.statistic}>Днів користування: 1</div>
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