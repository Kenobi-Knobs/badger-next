import { useSession } from 'next-auth/react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import RedirectView from '@/components/RedirectView'
import LoadingView from '@/components/LoadingView'
import { useState } from 'react'

export default function Home() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	const handleLogout = async () => {
		setLoading(true)
		const signOutResponce = await signOut({ redirect: false, callbackUrl: '/login' })
		router.push(signOutResponce.url)
	}

	if (status === "authenticated") {
		return (
			<>
				<p>Аккаунт</p>
				<pre>{JSON.stringify(session.user)}</pre>
				<button onClick={() => handleLogout()}>Вийти</button>
			</>
		)
	}

	if (status === "loading" || loading) {
		return <LoadingView />
	}

	return <RedirectView 
		text="Авторизуйтесь для використання сервісу"
		buttonText="Ввійти" 
		redirect={() => router.push('/login')} 
	/>
}
