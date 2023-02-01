import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'bson';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"

type ResponseData = {
	error: string | null;
};

// method: POST
// delete a notification for the current user by id
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
	) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method Not Allowed' });
	}

	const token = await getToken({ req, secret: process.env.JWT_SECRET });
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const client = await clientPromise;
	const db = client.db();

	const notificationId = req.body.notificationId;

	const result = await db.collection('notifications').deleteOne({
		_id: new ObjectId(notificationId),
		userId: token.uid
	});

	if (result.deletedCount === 0) {
		return res.status(400).json({ error: 'Notification not found' });
	}

	res.status(200).json({ error: '' });
}