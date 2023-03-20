//query fot get information about user if user auth
import clientPromise from '@/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"

type ResponseData = {
	error: string | null;
	user: any;
};

// method: GET
// get current user information
export default async function handler(
	req: NextApiRequest,
	res: NextApiResponse<ResponseData>
	) {
	if (req.method !== 'GET') {
		return res.status(405).json({ error: 'Method Not Allowed', user: null });
	}

	const token = await getToken({ req, secret: process.env.JWT_SECRET });
	if (!token) {
		return res.status(401).json({ error: 'Unauthorized', user: null });
	}

	const client = await clientPromise;
	const db = client.db();

	const user = await db.collection('users').findOne({id: token.uid});

	res.status(200).json({ error: '', user: user });
}
