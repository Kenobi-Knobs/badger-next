import { ReactElement } from 'react'
import AppLayout from '../../components/AppLayout'
import type { NextPageWithLayout } from './../_app'
import WidgetLayout from '../../components/WidgetLayout'
import clientPromise from '@/lib/mongodb'
import LoadingView from '@/components/LoadingView'
import { ObjectId } from 'bson';
import dynamic from 'next/dynamic'

export async function getServerSideProps(context : any) {
	const id = context.query.widgetID;
	const client = await clientPromise;
	const db = client.db();
	const widget = await db.collection('widgets').findOne({
		 _id: new ObjectId(id)
	});

	const name = widget?.name || "Віджет";
	const widgetId = widget?._id.toString()|| "";
	const shortname = widget?.shortname || "";

	return { props: { title: name, id: widgetId, shortname: shortname } }
}

const Widget: NextPageWithLayout = (context : any) => {
	const path = context.shortname;
	const WidgetComponent = dynamic(() => import(`../../widgets/${path}`), 
	{
		ssr: false,
		loading: () => <LoadingView />,
	});

	return (
		<>
			<WidgetComponent/>
		</>
	)
}

Widget.getLayout = function getLayout(content: ReactElement) {
	return (
		<>
			<AppLayout>
				<WidgetLayout>
					{content}
				</WidgetLayout>
			</AppLayout>
		</>
	)
}

export default Widget