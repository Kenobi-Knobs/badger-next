import { ReactElement, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import type { NextPageWithLayout } from './_app'
import { useSession } from "next-auth/react"
import LoadingView from '@/components/LoadingView'
import { useState } from 'react'
import WidgetPreview from '@/components/WidgetPreview'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'

const Home: NextPageWithLayout = () => {
	const { data: session, status } = useSession();
	const [widgets , setWidgets] = useState<any[]>([]);
	const [loading , setLoading] = useState(false);
	const router = useRouter();

	const deleteWidget = async (id: string) => {
		const updatedWidgets = widgets.filter((widget) => widget._id !== id);
		setWidgets(updatedWidgets);
	}

	const openWidget = async (event:any, id: string) => {
		if (event.target.className.includes('delete')) {
			return;
		}
		router.push(`/widget/${id}`);
	}

	const getWidgets = async () => {
		setLoading(true);
		const res = await fetch('/api/getWidgetsPreview', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		});
		const data = await res.json();
		setWidgets(data.widgets);
		setLoading(false);
	}

	useEffect(() => {
		getWidgets();
	} ,[])

	if (status === 'loading' || loading) {
		return <LoadingView />
	} else {
		return (
			<>
				<div className={styles.widgetContainer}>
					{widgets.map((widget) => (
						<WidgetPreview key={widget.id} widget={widget} deleteWidget={deleteWidget} openWidget={openWidget}/>
					))}
				</div>
			</>
		)
	}
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
