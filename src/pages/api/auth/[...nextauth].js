import NextAuth from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { CheckLoginData } from "@/lib/telegramVerifyLogin"
import clientPromise from "@/lib/mongodb";

export const authOptions = {
	providers: [
		CredentialsProvider({
			id: 'telegramLogin',
			name: 'telegramLogin',
			credentials: {},
			async authorize(credentials, req) {
				const user = CheckLoginData(req.query)
				if (user.id && user.first_name) {
					const client = await clientPromise;
					const db = await client.db();
					const collection = await db.collection('users');
					const userExists = await collection.findOne({ id: user.id });
					if (!userExists) {
						await collection.insertOne({
							id: user.id,
							name: [user.first_name, user.last_name || ''].join(' '),
							image: user.photo_url,
							username: user.username,
							registeredAt: new Date(),
						});
					} else {
						await collection.updateOne(
							{ id: user.id },
							{
								$set: {
									name: [user.first_name, user.last_name || ''].join(' '),
									username: user.username,
									image: user.photo_url,
								},
							});
					}
					return {
						id: user.id.toString(),
						name: [user.first_name, user.last_name || ''].join(' '),
						image: user.photo_url,
					};
				}
				return null;
			},
		}),
	],
	callbacks: {
		session: async ({ session, token }) => {
			if (session?.user) {
				session.user.id = token.uid;
			}
			return session;
		},
		jwt: async ({ user, token }) => {
			if (user) {
				token.uid = user.id;
			}
			return token;
		},
	},
	session: {
		strategy: 'jwt',
	},
	pages: {
		signIn: '/login',
		signOut: '/login',
		error: '/login',
	},
	jwt: {
		secret: process.env.JWT_SECRET,
	},
	}
export default NextAuth(authOptions)