import type { ReactElement } from 'react'
import AppLayout from '../components/AppLayout'
import type { NextPageWithLayout } from './_app'

const Home: NextPageWithLayout = () => {
	return <p>Main</p>
}

Home.getLayout = function getLayout(page: ReactElement) {
	return (
		<>
			<AppLayout>
				{page}
			</AppLayout>
		</>
	)
}

export default Home
