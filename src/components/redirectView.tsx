import React from 'react';
import styles from '../styles/RedirectView.module.css'

const RedirectView = (props: any) => {
	const { text, buttonText, redirect } = props;
	return (
		<div className={styles.container}>
			<div className={styles.descriptionText}>{text}</div>
			<button onClick={() => redirect()} className={styles.redirectButton}>{buttonText}</button>
		</div>
	);
};

export default RedirectView;