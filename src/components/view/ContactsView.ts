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

		// Кнопка

		this.submitButton = ensureElement<HTMLButtonElement>(
			'.button',
			this.container
		);

		// Почта

		this.emailInput = ensureElement<HTMLInputElement>(
			'[name="email"]',
			this.container
		);

		// Номер телефона

		this.phoneInput = ensureElement<HTMLInputElement>(
			'[name="phone"]',
			this.container
		);

		// Обработчик поля почты

		this.emailInput.addEventListener('input', () => {});

		// Обработчик поля номер телефона

		this.phoneInput.addEventListener('input', () => {});

		// Обработчик отправки формы

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
