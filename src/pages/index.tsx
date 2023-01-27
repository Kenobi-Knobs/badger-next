import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import { useRouter } from "next/router"
import RedirectView from "@/components/redirectView"

export default function Home() {
	const { data: session, status } = useSession()
	const router = useRouter()

	const handleLogout = async () => {
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

	return <RedirectView 
		text="Авторизуйтесь для використання сервісу"
		buttonText="Ввійти" 
		redirect={() => router.push('/login')} 
	/>
}
