import { IOrder, IOrderForm } from '../../types';
import { IEvents } from '../base/events';
import { Model } from '../base/Model';
import { BasketModel } from './BasketModel';

type FormErrors = Partial<Record<keyof IOrderForm, string>>;

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

	constructor(protected events: IEvents, protected basketModel: BasketModel) {
		super({} as IOrder, events);
	}

	// добавляем те поля данных которые еще не были добавлены
	setOrderData(order: Partial<IOrder>) {
		this.order = { ...this.order, ...order };
	}

	// устанавливаем значение поля заказа, и запускаем валидацию
	setOrderField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		this.validateOrder();
	}

	// устанавливаем значение поля контактов, и запускаем валидацию
	setContactsField(field: keyof IOrderForm, value: string) {
		this.order[field] = value;

		this.validateUserData();
	}

	// валидация данных заказа
	validateOrder() {
		const errors: FormErrors = {};
		if (!this.order.address) {
			errors.address = 'Введите адрес';
		} else {
			errors.address = '';
		}

		// Обновляем ошибки формы
		this.formErrors = { ...this.formErrors, ...errors };
		this.events.emit('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	// валидация данных контакты
	validateUserData() {
		const errors: FormErrors = {};

		// Валидация email
		if (!this.order.email) {
			errors.email = 'Введите почту';
		} else {
			errors.email = '';
		}

		// Валидация телефона
		if (!this.order.phone) {
			errors.phone = 'Введите номер телефона';
		} else {
			errors.phone = '';
		}
		// Обновляем ошибки формы
		this.formErrors = { ...this.formErrors, ...errors };
		this.events.emit('formErrors:contacts:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}
}
