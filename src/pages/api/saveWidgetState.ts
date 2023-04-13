import clientPromise from '@/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"

type ResponseData = {
	status: string;
	error: string | null;
};

// method: POST
// save widget state
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
	
	const widgetId = req.body.widgetId;
	const widgetState = req.body.widgetState;

	// insert or update widget state
	await db.collection('widgetStates').updateOne(
		{ userId: user.id, widgetId: widgetId },
		{ $set: { state: widgetState } },
		{ upsert: true }
	);

	res.status(200).json({status: "success", error: '' });
}