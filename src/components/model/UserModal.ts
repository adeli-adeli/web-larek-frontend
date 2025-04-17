import {
	ICatalogModel,
	IOrder,
	IProduct,
	IOrderForm,
	IOrderFormModel,
	
} from '../../types';
import { IEvents } from '../base/events';


export class UserModel implements IOrderFormModel {
	protected payment: string;
	protected address: string;
	protected email: string;
	protected phone: string;
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	getUserInfo(): IOrderForm {
		const { payment, address, email, phone } = this;
		return {
			payment,
			address,
			email,
			phone,
		};
	}

	setUserInfo(userData: IOrderForm): void {
		this.payment = userData.payment;
		this.address = userData.address;
		this.email = userData.email;
		this.phone = userData.phone;
		this.events.emit('user:changed');
	}

	// ValidationPaymentInfo(
	// 	data: Record<keyof TUserPaymentInfo, string>
	// ): Partial<Record<keyof TUserPaymentInfo, string>> {
	// 	const errors: Partial<Record<keyof TUserPaymentInfo, string>> = {};

	// 	if (!data.address || data.address.trim() === '') {
	// 		errors.address = 'Введите адресс доставки';
	// 	}

	// 	return errors;
	// }

	ValidationUserInfo(
		data: Record<keyof IOrderForm, string>
	): Partial<Record<keyof IOrderForm, string>> {
		const errors: Partial<Record<keyof IOrderForm, string>> = {};

		if (!data.email || data.email.trim() === '') {
			errors.email = 'Необходимо указать email';
		}
		if (!data.phone || data.phone.trim() === '') {
			errors.phone = 'Необходимо указать номер телефона';
		}

		return errors;
	}
}
