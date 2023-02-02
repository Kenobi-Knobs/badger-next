import { useSession } from 'next-auth/react'
import { useEffect } from 'react'
import { signOut } from 'next-auth/react'
import { useRouter } from 'next/router'
import LoadingView from '@/components/LoadingView'
import { useState } from 'react'
import styles from '../styles/Home.module.css'
import Header from '@/components/Header'
import Navigation from '@/components/Navigation'

export default function Home() {
	const { data: session, status } = useSession()
	const router = useRouter()
	const [loading, setLoading] = useState(false)

	useEffect(() => {
		if (status === "unauthenticated") {
			router.push('/login')
		}
	}, [status])

	const handleLogout = async () => {
		setLoading(true)
		const signOutResponce = await signOut({ redirect: false, callbackUrl: '/login' })
		router.push(signOutResponce.url)
	}

	if (status === "authenticated") {
		return (
			<div className={styles.pageContainer}>
				<Navigation current="home"></Navigation>
				<Header
					session={session}
					handleLogout={handleLogout}
					welcome={true}>
				</Header>
			</div>
		)
	}

	if (status === "loading" || loading) {
		return <LoadingView />
	}
}
