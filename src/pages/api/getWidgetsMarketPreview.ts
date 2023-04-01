import clientPromise from '@/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"

type ResponseData = {
	error: string | null;
	widgets: any[];
};

// method: GET
// get widgets previews for current user
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
	) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method Not Allowed', widgets: [] });
	}

	const token = await getToken({ req, secret: process.env.JWT_SECRET });
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized', widgets: [] });
	}
	
	const client = await clientPromise;
	const db = client.db();

	const widgets = await db.collection('widgets').find({}).toArray();

	res.status(200).json({ error: '', widgets: widgets });
}