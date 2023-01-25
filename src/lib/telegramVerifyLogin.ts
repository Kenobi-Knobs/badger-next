import { createHash, createHmac } from 'crypto'
import { TelegramUser } from 'telegram-login-button'

const BotToken = process.env.TELEGRAM_BOT_TOKEN || ''

type LoginData = {
	id: number
	first_name: string
	last_name?: string
	username?: string
	photo_url?: string
	auth_date: number
}

export const CheckLoginData = (data: TelegramUser) => {
	const { hash, ...dataWithoutHash } = data
	const checkString = GetCheckString(dataWithoutHash)
	const secret = createHash('sha256')
		.update(BotToken, 'utf8')
		.digest()
	const hashString = createHmac('sha256', secret)
		.update(checkString, 'utf8')
		.digest('base64')
	if (hashString !== hash){
		return dataWithoutHash
	} else {
		return null
	}
}

const GetCheckString = (data: LoginData) => {
	return Object.keys(data)
		.sort()
		.map((key) => `${key}=${data[key as keyof LoginData]}`)
		.join('\n')
}