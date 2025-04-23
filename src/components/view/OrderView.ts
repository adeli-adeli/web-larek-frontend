import { IOrderForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { OrderModel } from '../model/OrderModel';
import { Form } from '../../common/Modal/Form';

export class OrderView extends Form<IOrderForm> {
	protected paymentButtons: NodeListOf<HTMLButtonElement>;
	protected submitButton: HTMLElement;
	protected addressInput: HTMLInputElement;
	protected orderModel: OrderModel;

	constructor(
		protected container: HTMLFormElement,
		protected events: IEvents,
		orderModel: OrderModel
	) {
		super(container, events);
		this.orderModel = orderModel;

		// получаем кнопки оплаты
		this.paymentButtons = this.container.querySelectorAll(
			'.order__buttons button'
		);

		// адрес
		this.addressInput = ensureElement<HTMLInputElement>(
			'[name="address"]',
			this.container
		);

		// кнопка отправки
		this.submitButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.container
		);

		// обработчик выбора способа оплаты
		this.paymentButtons.forEach((btn) => {
			btn.addEventListener('click', () => {
				this.setPayment(btn.name as 'card' | 'cash');
				this.orderModel.setOrderData({ payment: btn.name as 'card' | 'cash' });
			});
		});

		// обработка ввода адреса
		this.addressInput.addEventListener('input', () => {
			this.orderModel.setOrderData({ address: this.addressInput.value });
			this.checkValidity();
		});

		// обработка отправки формы
		if (this.submitButton) {
			this.submitButton.addEventListener('click', (evt) => {
				evt.preventDefault();
				events.emit('order:form:submit');
			});
		}
	}

	// устанавливает выбранный способ оплаты
	setPayment(method: 'card' | 'cash') {
		this.paymentButtons.forEach((btn) => {
			const isSelected = btn.name === method;
			this.toggleClass(btn, 'button_alt', isSelected);
			this.toggleClass(btn, 'button_alt', !isSelected);
		});
	}

	// устанавливает значение адреса
	set address(value: string) {
		this.addressInput.value = value;
	}
}
