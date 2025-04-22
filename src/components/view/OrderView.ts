import { FormErrors, IOrderForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { OrderModel } from '../model/OrderModel';
import { Form } from './FormView';

export class Order extends Form<IOrderForm> {
	protected paymentButtons: NodeListOf<HTMLButtonElement>;
	protected submitButton: HTMLElement;
	protected addressInput: HTMLInputElement;
	protected orderModel: OrderModel;

	constructor(container: HTMLFormElement, events: IEvents, orderModel: OrderModel) {
		super(container, events);
		this.orderModel = orderModel;

		// Получаем кнопки оплаты

		this.paymentButtons = this.container.querySelectorAll(
			'.order__buttons button'
		);

		// Адресс

		this.addressInput = ensureElement<HTMLInputElement>(
			'[name="address"]',
			this.container
		);

		// Кнопка отправки

		this.submitButton = ensureElement<HTMLButtonElement>(
			'.order__button',
			this.container
		);

		// Обработчик выбора способа оплаты

		this.paymentButtons.forEach((btn) => {
			btn.addEventListener('click', () => {
				this.setPayment(btn.name as 'card' | 'cash');
			});
		});

		// Обработка ввода адресса

		this.addressInput.addEventListener('input', () => {});

		// Обработка отправки формы

		if (this.submitButton) {
			this.submitButton.addEventListener('click', (evt) => {
				evt.preventDefault();
				events.emit('order:form:submit');
			});
		}
	}

	// Устанавливаем выбранный способ оплаты

	setPayment(method: 'card' | 'cash') {
		this.paymentButtons.forEach((btn) => {
			const isSelected = btn.name === method;
			console.log(`Кнопка: ${method}, выбрана: ${isSelected} `);
			this.toggleClass(btn, 'button_alt', isSelected);
			this.toggleClass(btn, 'button_alt', !isSelected);
		});
	}

	// Устанавливаем значение адресса

	set address(value: string) {
		this.addressInput.value = value;
	}
}
