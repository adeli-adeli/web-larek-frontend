import { FormErrors, IOrderForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { AppState } from '../model/AppData';
import { Form } from './FormView';

export class Order extends Form<IOrderForm> {
	protected paymentButtons: NodeListOf<HTMLButtonElement>;
	protected submitButton: HTMLElement;
	protected addressInput: HTMLInputElement;
	protected appState: AppState;

	constructor(container: HTMLFormElement, events: IEvents, appState: AppState) {
		super(container, events);
		this.appState = appState;

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

		this.addressInput.addEventListener('input', () => {
			this.appState.setOrderField('address', this.addressInput.value);
		});

		// Обработка отправки формы

		if (this.submitButton) {
			this.submitButton.addEventListener('click', (evt) => {
				evt.preventDefault();
				this.appState.setOrderField('address', this.addressInput.value);
				events.emit('order:form:submit');
			});
		}
	}

	// Устанавливаем выбранный способ оплаты

	setPayment(method: 'card' | 'cash') {
		this.appState.setOrderField('payment', method);

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
