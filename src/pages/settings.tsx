import type { ReactElement } from 'react'
import AppLayout from '../components/AppLayout'
import type { NextPageWithLayout } from './_app'
import WidgetLayout from '../components/WidgetLayout'
import styles from '../styles/Settings.module.css'
import { useSession } from 'next-auth/react'
import LoadingView from '@/components/LoadingView'

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
				<p>{session?.user?.name}</p>
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