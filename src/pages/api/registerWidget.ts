import clientPromise from '@/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"

type ResponseData = {
	status: string;
	error: string | null;
};

// method: POST
// register a widget if user admin
// widgetId: the id of the widget to register
// userId: the id of the user to register the widget to
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
	) {
	if (req.method !== 'POST') {
		return res.status(405).json({status: "error", error: 'Method Not Allowed' });
	}

	const token = await getToken({ req, secret: process.env.JWT_SECRET });
	if (!token) {
		return res.status(401).json({status: "error", error: 'Unauthorized' });
	}

	const client = await clientPromise;
	const db = client.db();

	const user = await db.collection('users').findOne({ id: token.uid });
	if (!user) {
		return res.status(403).json({status: "error", error: 'User not found' });
	}
	if (user.role !== 'admin') {
		return res.status(403).json({status: "error", error: 'Forbidden' });
	}

	const widgetName = req.body.name;
	const widgetDescription = req.body.description;
	const widgetImage = req.body.image;
	const widgetShortName = req.body.shortName;

	const widget = await db.collection('widgets').findOne({ shortname: widgetShortName });
	if (widget) {
		return res.status(409).json({status: "error", error: 'Widget already exists' });
	}

	await db.collection('widgets').insertOne({
		name: widgetName,
		description: widgetDescription,
		image: widgetImage,
		shortname: widgetShortName
	});

	res.status(200).json({status: "success", error: '' });
}


