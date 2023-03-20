import styles from '../styles/WidgetPreview.module.css'
import Image from 'next/image'
import { useState } from 'react'

const WidgetPreview = (props: any) => {
	const {key, widget, deleteWidget } = props;
	const [deleteButton, setDeleteButton] = useState(false);

	return (
		<div className={styles.cardBody} onMouseEnter={() => setDeleteButton(true)} onMouseLeave={() => setDeleteButton(false)}>
			{deleteButton && 
				<div className={styles.deleteButton} onClick={() => deleteWidget(widget.id)}>
					<Image src='/close.svg' width={6} height={6} alt={'close'} className={styles.closeIcon}/>
				</div>
			}
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
		</div>
	)
}

export default WidgetPreview

