import clientPromise from '@/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"

type ResponseData = {
	status: string;
	error: string | null;
	state: any;
};

// method: GET
// save widget state
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
	) {
	if (req.method !== 'GET') {
		return res.status(405).json({status: "error", error: 'Method Not Allowed', state: null });
	}

	const token = await getToken({ req, secret: process.env.JWT_SECRET });
	if (!token) {
		return res.status(401).json({status: "error", error: 'Unauthorized', state: null });
	}

	const client = await clientPromise;
	const db = client.db();

	const user = await db.collection('users').findOne({ id: token.uid });
	if (!user) {
		return res.status(403).json({status: "error", error: 'User not found', state: null });
	}

	const widgetId = req.query.widgetId as string;

	const widgetState = await db.collection('widgetStates').findOne({ userId: user.id, widgetId: widgetId });
	if (!widgetState) {
		return res.status(404).json({status: "error", error: 'Widget state not found', state: null });
	}

	res.status(200).json({status: "success", error: '', state: widgetState.state });
}