import clientPromise from '@/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"

type ResponseData = {
	error: string | null;
};

// method: DELETE
// delete widget from user
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
	) {
	if (req.method !== 'DELETE') {
		return res.status(405).json({ error: 'Method Not Allowed' });
	}

	const token = await getToken({ req, secret: process.env.JWT_SECRET });
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const client = await clientPromise;
	const db = client.db();

	const user = await db.collection('users').findOne({id: token.uid});
	if (!user) {
		return res.status(401).json({ error: 'Unauthorized' });
	}

	const result = await db.collection('users').updateOne({id: token.uid}, {$pull: {widgets: req.body.id}});
	if (result.modifiedCount === 0) {
		return res.status(400).json({ error: 'Widget not found' });
	}

	res.status(200).json({ error: '' });
}