import { ReactElement, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import type { NextPageWithLayout } from './_app'

const Market: NextPageWithLayout = () => {

	return (
		<>
			<div>
				Market
			</div>
		</>
	)
}


Market.getLayout = function getLayout(page: ReactElement) {
	return (
		<>
			<AppLayout>
				{page}
			</AppLayout>
		</>
	)
}

export default Market
