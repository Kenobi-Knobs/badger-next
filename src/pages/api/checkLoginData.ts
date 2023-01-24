import type { NextApiRequest, NextApiResponse } from 'next'
import { TelegramUser } from 'telegram-login-button'
import { checkLoginData } from '../../lib/telegramVerifyLogin'

type Data = {
	description?: string
	token?: string
}

export default function handler(
	req: NextApiRequest,
	res: NextApiResponse<Data>
) {
	if (checkLoginData(req.body)) {
		//check user in db
		res.status(200).json({description: 'Успішно', token: '231231'})
	} else {
		res.status(400).json({description: 'Некоректні дані'})
	}
}