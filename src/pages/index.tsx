import { ReactElement, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import type { NextPageWithLayout } from './_app'
import { useSession } from "next-auth/react"
import LoadingView from '@/components/LoadingView'
import { useState } from 'react'
import WidgetPreview from '@/components/WidgetPreview'
import styles from '@/styles/Home.module.css'
import { useRouter } from 'next/router'
import { toast } from "react-toastify";

const Home: NextPageWithLayout = () => {
	const { data: session, status } = useSession();
	const [widgets , setWidgets] = useState<any[]>([]);
	const [loading , setLoading] = useState(false);
	const router = useRouter();

	const deleteWidget = async (id: string) => {
		const res = await fetch('/api/deleteWidget', {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({id})
		});
		const data = await res.json();
		if (data.error) {
			toast.error(data.error);
			return;
		}
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
				{widgets.length != 0 && 
					<>
						<div className={styles.header}>
							Ось ваші додатки
						</div>
						<div className={styles.widgetContainer}>
							{widgets.map((widget) => (
								<WidgetPreview key={widget._id.toString()} widget={widget} deleteWidget={deleteWidget} openWidget={openWidget}/>
							))}
						</div>
					</>
				}
				{widgets.length == 0 &&
					<div className={styles.noWidgets}>
						У вас немає застосунків, оберіть їх з доступних в бібліотеці.
					</div>
				}
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
