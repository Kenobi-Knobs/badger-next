import jwt from 'jsonwebtoken';

interface JwtPayload {
	id: string;
}

const secret = process.env.JWT_SECRET || '';

export const generateToken = (id: string) => {
	return jwt.sign({id: id}, secret, { expiresIn: '1h' });
}

export const verifyToken = (token: string) => {
	return jwt.verify(token, secret);
}

export const checkToken = (token: string) => {
	try {
		const decoded = verifyToken(token) as JwtPayload;
		return {id: decoded.id};
	} catch (error) {
		return {error: 'invalid token'};
	}
}