import clientPromise from '@/lib/mongodb'
import type { NextApiRequest, NextApiResponse } from 'next'
import { getToken } from "next-auth/jwt"
import { ObjectId } from 'bson';

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

	const user = await db.collection('users').findOne({id: token.uid});
	if (!user) {
		return res.status(401).json({ error: 'Unauthorized', widgets: [] });
	}
	user.widgets = user.widgets.map((id: string) => new ObjectId(id));
	const widgets = await db.collection('widgets').find({_id: {$in: user.widgets}}).toArray();

	res.status(200).json({ error: '', widgets: widgets });
}