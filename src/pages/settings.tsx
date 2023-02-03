import type { ReactElement } from 'react'
import AppLayout from '../components/AppLayout'
import type { NextPageWithLayout } from './_app'

export async function getStaticProps() {
	return { props: { welcome: false, current: 'settings'}}
}

const Settings: NextPageWithLayout = () => {
	return <p>Settings</p>
}

Settings.getLayout = function getLayout(page: ReactElement) {
	return (
		<>
			<AppLayout>
				{page}
			</AppLayout>
		</>
	)
}

export default Settings