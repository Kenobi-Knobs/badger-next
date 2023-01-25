import { useSession } from "next-auth/react"
import { signOut } from "next-auth/react"
import Link from "next/link"

export default function Home() {
	const { data: session, status } = useSession()

	if (status === "authenticated") {
		return (
			<>
				<p>Signed in as</p>
				<pre>{JSON.stringify(session.user)}</pre>
				<button onClick={() => signOut()}>Sign out</button>
			</>
		)

	}

	return <Link href="/login">Sign in</Link>
}
