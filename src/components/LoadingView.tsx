import styles from '../styles/LoadingView.module.css'
import { NewtonsCradle } from '@uiball/loaders'

const LoadingView = () => {
	return (
		<div className={styles.container}>
			<NewtonsCradle 
				size={40}
				speed={1.4} 
				color="black" 
			/>
			<div className={styles.loadingText}>Відбуваються всілякі речі...</div>
		</div>
	)
}

export default LoadingView