import { toast } from "react-toastify";
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button'
import { useSession, signIn} from "next-auth/react"
import { useRouter  } from 'next/router';
import { useState } from 'react';
import RedirectView from '@/components/RedirectView';
import LoadingView from "@/components/LoadingView";
import styles from '../styles/Login.module.css'

export default function LoginPage() {
	const BotName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME
	const router = useRouter()
	const { data: session, status } = useSession()
	const [loading, setLoading] = useState(false)

	const handleLogin = async (user: TelegramUser) => {
		setLoading(true)
		const signInResponce = await signIn('telegramLogin', { callbackUrl: '/', redirect: false}, user as any)
		if (signInResponce?.status === 200) {
			router.push('/')
		}
		else {
			setLoading(false)
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

	if (status === "loading" || loading) {
		return <LoadingView />
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
			<div className={styles.container}>
				<div className={styles.descriptionText}>Авторизуйтесь за допомогою Telegram, таким чином ми отримаємо необхідні дані про вас та зможемо вас ідентифікувати.</div>
				<TelegramLoginButton
					botName={BotName}
					dataOnauth={(user: TelegramUser) => handleLogin(user)}
				/>
			</div>
		</>
	)
}