import { ReactElement } from 'react'
import AppLayout from '../../components/AppLayout'
import type { NextPageWithLayout } from './../_app'
import WidgetLayout from '../../components/WidgetLayout'
import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'bson';

export async function getServerSideProps(context : any) {
	const id = context.query.widgetID;
	const client = await clientPromise;
	const db = client.db();
	const widget = await db.collection('widgets').findOne({
		 _id: new ObjectId(id)
	});

	const name = widget?.name || "Віджет";
	return { props: { title: name } }
}

const Widget: NextPageWithLayout = () => {
	return (
		<>
			<div>
				widgetContent
			</div>
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