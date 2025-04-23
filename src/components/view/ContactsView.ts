import { IOrderForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { OrderModel } from '../model/OrderModel';
import { Form } from '../../common/Modal/Form';

export class ContactsView extends Form<IOrderForm> {
	protected submitButton: HTMLElement;
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;
	protected orderModel: OrderModel;

	constructor(
		protected container: HTMLFormElement,
		protected events: IEvents,
		orderModel: OrderModel
	) {
		super(container, events);
		this.orderModel = orderModel;

		// кнопка
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.button',
			this.container
		);

		// почта
		this.emailInput = ensureElement<HTMLInputElement>(
			'[name="email"]',
			this.container
		);

		// номер телефона
		this.phoneInput = ensureElement<HTMLInputElement>(
			'[name="phone"]',
			this.container
		);

		// обработчик поля почты
		this.emailInput.addEventListener('input', () => {
			this.orderModel.setOrderData({email: this.emailInput.value})
			this.checkValidity()
		});

		// обработчик поля номер телефона
		this.phoneInput.addEventListener('input', () => {
			this.orderModel.setOrderData({phone: this.phoneInput.value})
			this.checkValidity()
		});

		// обработчик отправки формы
		if (this.submitButton) {
			this.submitButton.addEventListener('click', (evt) => {
				evt.preventDefault();

				this.events.emit('order:submit', this.orderModel.order);
			});
		}
	}

	// устанавливает значение почты
	set email(value: string) {
		this.emailInput.value = value;
	}

	// устанавливает значение номер телефона
	set phone(value: string) {
		this.phoneInput.value = value;
	}
}
