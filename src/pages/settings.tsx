import { ReactElement, useState, useEffect } from 'react'
import AppLayout from '../components/AppLayout'
import type { NextPageWithLayout } from './_app'
import WidgetLayout from '../components/WidgetLayout'
import styles from '../styles/Settings.module.css'
import LoadingView from '@/components/LoadingView'
import Image from 'next/image'
import { toast } from "react-toastify";

export async function getStaticProps() {
	return { props: { title: 'Налаштування ⚙️'}}
}

const Settings: NextPageWithLayout = () => {
	const [user, setUser] = useState<any>(null);
	const [loading , setLoading] = useState(false);

	const getUsingDayCount = (registeredAt: string) => {
		const date = new Date(registeredAt);
		const today = new Date();
		const diffTime = Math.abs(today.getTime() - date.getTime());
		const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
		return diffDays;
	}

	const getUserinfo = async () => {
		setLoading(true);
		const res = await fetch('/api/getUser', {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			}
		});
		const data = await res.json();
		setUser(data.user);
		setLoading(false);
	}

	const getFormData = () => {
		const name = document.getElementById('name') as HTMLInputElement;
		const description = document.getElementById('description') as HTMLInputElement;
		const image = document.getElementById('image') as HTMLInputElement;
		const shortName = document.getElementById('shortName') as HTMLInputElement;

		return {
			name: name.value,
			description: description.value,
			image: image.value,
			shortName: shortName.value,
		}
	}

	const registerWidget = async () => {
		const formData = getFormData();

		if (!formData.name || !formData.description || !formData.image || !formData.shortName) {
			toast.error('Заповніть всі поля', {
				position: "bottom-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
			return;
		}

		const res = await fetch('/api/registerWidget', {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				'Authorization': `Bearer ${localStorage.getItem('token')}`
			},
			body: JSON.stringify({
				name: formData.name,
				description: formData.description,
				image: formData.image,
				shortName: formData.shortName,
			})
		});
		const data = await res.json();
		if (data.status === 'success') {
			toast.success('Віджет успішно зареєстровано', {
				position: "bottom-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
		} else {
			toast.error(data.error, {
				position: "bottom-center",
				autoClose: 5000,
				hideProgressBar: true,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
				theme: "light",
			});
		}
	}

	useEffect(() => {
		getUserinfo();
	} ,[])

	if (loading) {
		return <LoadingView />
	} else {
		return (
			<>
				<div className={styles.headerContainer}>
					<div className={styles.userProfile}>
						<Image 
							src={user?.image || '/userpic.png'}
							width={80}
							height={80}
							alt="User avatar"
							className={styles.avatar}
						/>
						<div className={styles.userNameContainer}>
							<div className = {styles.topContainer}>
								<div className={styles.userFullName}>{user?.name || ''}</div>
								{user?.role === 'admin' && <div className={styles.adminBadge}>admin</div>}
							</div>
							<div className={styles.userName}>{'@' + user?.username || ''}</div>
						</div>
					</div>
					<div className={styles.headerStatistics}>
						<div className={styles.statistic}>Днів користування: {getUsingDayCount(user?.registeredAt)}</div>
						<div className={styles.statistic}>Віджетів: {user?.widgets?.length || 0}</div>
					</div>
				</div>
				<div className={styles.settingsContainer}>
					<div>
						<div className={styles.settingComponent}>
							<div className={styles.settingLeftBlock}>
								<div className={styles.settingName}>Скидання віджетів</div>
								<div className={styles.settingDescription}>Це скине всі віджети до початкового стану</div>
							</div>
							<button className={styles.settingButton}>Скинути</button>
						</div>
						<div className={styles.settingComponent}>
							<div className={styles.settingLeftBlock}>
								<div className={styles.settingName}>Сповіщення</div>
								<div className={styles.settingDescription}>Якщо вимкнути сповіщення ви не будете отримувати повідомлення від сервісу чи користувачів</div>
							</div>
							<button className={styles.settingButton}>Вимкнути</button>
						</div>
					</div>
					<div>
						{user?.role === 'admin' &&
							<div className={styles.registerWidgetFormContainer}>
								<div className={styles.registerWidgetForm}>
									<div className={styles.registerWidgetFormHeader}>Реєстрація віджету</div>
									<div className={styles.registerWidgetFormInputContainer}>
										<div className={styles.registerWidgetFormInputName}>Назва віджету</div>
										<input className={styles.registerWidgetFormInput} type="text" placeholder="Назва віджету" id="name" required/>
									</div>
									<div className={styles.registerWidgetFormInputContainer}>
										<div className={styles.registerWidgetFormInputName}>Опис віджету</div>
										<textarea className={styles.registerWidgetFormInput} placeholder="Опис віджету" id="description" required/>
									</div>
									<div className={styles.registerWidgetFormInputContainer}>
										<div className={styles.registerWidgetFormInputName}>Фото</div>
										<input className={styles.registerWidgetFormInput} type="text" placeholder="/widgetsResources/widgetPhoto.png" id="image" required/>
									</div>
									<div className={styles.registerWidgetFormInputContainer}>
										<div className={styles.registerWidgetFormInputName}>Коротка назва</div>
										<input className={styles.registerWidgetFormInput} type="text" placeholder="test-widget" id="shortName" required/>
									</div>
									<button className={styles.registerWidgetFormButton} onClick={() => registerWidget()}>Зареєструвати</button>
								</div>
							</div>
						}
					</div>
				</div>
			</>
		)
	}
}

Settings.getLayout = function getLayout(settings: ReactElement) {
	return (
		<>
			<AppLayout>
				<WidgetLayout>
					{settings}
				</WidgetLayout>
			</AppLayout>
		</>
	)
}

export default Settings