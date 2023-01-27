import Head from 'next/head'
import { toast } from "react-toastify";
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button'
import { useSession, signIn} from "next-auth/react"
import { useRouter  } from 'next/router';
import Link from 'next/link';
import RedirectView from '@/components/redirectView';

export default function LoginPage() {
	const BotName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME
	const router = useRouter()
	const { data: session, status } = useSession()

	const handleLogin = async (user: TelegramUser) => {
		const signInResponce = await signIn('telegramLogin', { callbackUrl: '/', redirect: false}, user as any)
		if (signInResponce?.status === 200) {
			router.push('/')
		}
		else {
			toast.error('Login failed', {
				position: "bottom-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
		}
	}

	if (status === "loading") {
		return (
			<>
				<p>Завантаження...</p>
			</>
		)
	}

	if (status === "authenticated") {
		return  <RedirectView 
			text="Ви вже авторизовані"
			buttonText="Перейти на головну"
			redirect={() => router.push('/')}
		/>
	}

	return (
		<>
			<Head>
				<title>Badger</title>
			</Head>
			<div className='container'>
				<h1>Badger</h1>
				<p>Ввійдіть за допомогою телеграм</p>
				<TelegramLoginButton
					botName={BotName}
					dataOnauth={(user: TelegramUser) => handleLogin(user)}
				/>
			</div>
		</>
	)
}