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

	// const widgets = await db.collection('widgets').find({userId: token.uid}).toArray();

	const widgets = [
		{
			id: 1,
			name: "widget1",
			image: "/widgets/15874.jpg",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vitae ultricies lacinia, nunc nisl aliquam nisl",
		},
		{
			id: 2,
			name: "widget2",
			image: "/widgets/2.jpg",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vitae ultricies lacinia, nunc nisl aliquam nisl",
		},
		{
			id: 3,
			name: "widget3",
			image: "/widgets/15874.jpg",
			description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, nisl vitae ultricies lacinia, nunc nisl aliquam nisl",
		}
	]

	res.status(200).json({ error: '', widgets: widgets });
}