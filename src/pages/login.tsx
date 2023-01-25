import Head from 'next/head'
import { toast } from "react-toastify";
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button'
import { useSession, signIn} from "next-auth/react"
import { useRouter  } from 'next/router';

export default function LoginPage() {
	const BotName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME
	const router = useRouter();

	const handleLogin = async (user: TelegramUser) => {
		const signInResponce = await signIn('telegramLogin', { callbackUrl: '/', redirect: false}, user as any)
		if (signInResponce?.status === 200) {
			router.push('/')
		}
		else {
			toast.error('Login failed')
		}
	}

	return (
		<>
			<Head>
				<title>Badger</title>
			</Head>
			<div className='container'>
				<h1>Badger</h1>
				<p>Badger is a simple, fast, and secure way to direct you finance.</p>
				<TelegramLoginButton
					botName={BotName}
					dataOnauth={(user: TelegramUser) => handleLogin(user)}
				/>
			</div>
		</>
	)
}