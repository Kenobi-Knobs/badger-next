import styles from '../styles/WidgetMarketPreview.module.css'
import Image from 'next/image'

const WidgetMarketPreview = (props: any) => {
	const {widget, userWidgets, addWidget} = props;

	const isInstalled = () => {
		for (let i = 0; i < userWidgets.length; i++) {
			if (userWidgets[i] === widget._id.toString()) {
				return true;
			}
		}
		return false;
	}
	
	return (
		<div className={styles.cardBody}>
			<div className={styles.cardImageContainer}>
				<Image
					src={widget.image}
					width={200}
					height={200}
					alt="widget image"
					className={styles.cardImage}
				/>
			</div>
			<div className={styles.cardName}>
				{widget.name}
			</div>
			<div className={styles.cardDescription}>
				{widget.description}
			</div>
			{isInstalled() ? (
				<div className={styles.cardButton}>
					<div className={styles.alreadyInstalled}>
						Додано
					</div>
				</div>
			) : (
				<div className={styles.cardButton}>
					<div className={styles.installButton} onClick={() => addWidget(widget._id.toString())}>
						Додати <div className={styles.plusIcon}>+</div>
					</div>
				</div>
			)}
		</div>
	)
}

export default WidgetMarketPreview