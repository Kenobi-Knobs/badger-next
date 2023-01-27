import React from 'react';

const RedirectView = (props: any) => {
	const { text, buttonText, redirect } = props;
	return (
		<div className="redirect-view">
			<div className="redirect-view-text">{text}</div>
			<button onClick={() => redirect()} className="redirect-view-button">{buttonText}</button>
		</div>
	);
};

export default RedirectView;