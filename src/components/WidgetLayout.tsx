import styles from '../styles/WidgetLayout.module.css'

export default function WidgetLayout({children} : any){
	return (
		<>
			<div className={styles.widgetTitle}>{children.props.title}</div>
			<div className={styles.widgetContainer}>
				{children}
			</div>
		</>
		)
}
