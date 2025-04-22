import { FormErrors, IOrder } from '../../types';
import { IEvents } from '../base/events';
import { Model } from '../base/Model';

export class OrderModel extends Model<IOrder> {
	order: IOrder = {
		payment: 'card',
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};
	formErrors: FormErrors = {};

	constructor(protected events: IEvents) {
		super({} as IOrder, events);
	}

	setOrderData(order: Partial<IOrder>) {
		this.order = { ...this.order, ...order };
		this.events.emit('order:changed', this.order);
	}

	setFormErrors(errors: FormErrors) {
		this.formErrors = errors;
		this.events.emit('formErrors:changed', errors);
	}

	resetOrder() {
		this.order = {
			payment: 'card',
			address: '',
			email: '',
			phone: '',
			items: [],
			total: 0,
		};
		this.formErrors = {};
		this.events.emit('order:reset');
	}
}
