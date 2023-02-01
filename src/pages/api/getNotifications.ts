import clientPromise from '@/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"

type ResponseData = {
	error: string | null;
	notifications: Array<any>;
};

// method: GET
// get notifications for the current user
// if week is true, only get notifications from the last week
// otherwise, get all notifications
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
	) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method Not Allowed', notifications: [] });
	}

	const token = await getToken({ req, secret: process.env.JWT_SECRET });
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized', notifications: [] });
	}

	const client = await clientPromise;
	const db = client.db();

	let notifications = [];

	if (req.query.week === 'true') {
		notifications = await db.collection('notifications')
		.find({userId: token.uid, date: 
			{$gt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)}
		}).toArray();
	} else {
		notifications = await db.collection('notifications').find({userId: token.uid}).toArray();
	}

	res.status(200).json({ error: '', notifications: notifications });
}