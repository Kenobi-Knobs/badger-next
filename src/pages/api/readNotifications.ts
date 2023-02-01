import clientPromise from '@/lib/mongodb'
import { ObjectId } from 'bson';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"

type ResponseData = {
	error: string | null;
};

// method: POST
// mark notifications as read
// readNotifications is an array of notification ids
// that should be marked as read
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
	) {
	if (req.method !== 'POST') {
		return res.status(405).json({ error: 'Method Not Allowed' });
	}

	const token = await getToken({ req, secret: process.env.JWT_SECRET });
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized'});
	}

	const client = await clientPromise;
	const db = client.db();

	const readNotifications = req.body.readNotifications;
	const userId = token.uid;

	const objectIds = readNotifications.map((id : any) => new ObjectId(id));

	await db.collection('notifications').updateMany(
		{userId: userId, _id: {$in: objectIds}},
		{$set: {read: true}}
	);

	res.status(200).json({ error: '' });
}