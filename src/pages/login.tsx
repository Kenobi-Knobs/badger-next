import Head from 'next/head'
import { toast } from "react-toastify";
import TelegramLoginButton, { TelegramUser } from 'telegram-login-button'

export default function Login() {
	const BotName = process.env.NEXT_PUBLIC_TELEGRAM_BOT_NAME

	const handleLogin = async (user: TelegramUser) => {
		const login = await fetch('/api/checkLoginData', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(user)
		})
		const status = await login.status;
		const data = await login.json()
		if (status === 200) {
			//SIGN IN
		} else {
			toast.error(data.description, {
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