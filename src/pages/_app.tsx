import '@/styles/globals.css'
import type { AppProps } from 'next/app'
import 'react-toastify/dist/ReactToastify.css'
import { ToastContainer } from 'react-toastify'
import { SessionProvider } from "next-auth/react"
import type { ReactElement, ReactNode } from 'react'
import type { NextPage } from 'next'

export type NextPageWithLayout<P = {}> = NextPage<P> & {
	getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
	Component: NextPageWithLayout
}

export default function App({ Component, pageProps: { session, ...pageProps }, }: AppPropsWithLayout) {
	const getLayout = Component.getLayout ?? ((page: ReactElement) => page)
	return (
		<SessionProvider session={session}>
			{getLayout(<Component {...pageProps} />)}
			<ToastContainer />
		</SessionProvider>
	)
}
