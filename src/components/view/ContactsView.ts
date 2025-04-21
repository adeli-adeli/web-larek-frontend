import { FormErrors, IOrderForm } from '../../types';
import { ensureElement } from '../../utils/utils';
import { IEvents } from '../base/events';
import { AppState } from '../model/AppData';
import { Form } from './FormView';

export class Contacts extends Form<IOrderForm> {
	protected submitButton: HTMLElement;
	protected emailInput: HTMLInputElement;
	protected phoneInput: HTMLInputElement;
	protected appState: AppState;

	constructor(container: HTMLFormElement, events: IEvents, appState: AppState) {
		super(container, events);
		this.appState = appState;

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

		this.emailInput.addEventListener('input', () => {
			this.appState.setOrderFieldContacts('email', this.emailInput.value);
		});

		// Обработчик поля номер телефона

		this.phoneInput.addEventListener('input', () => {
			this.appState.setOrderFieldContacts('phone', this.phoneInput.value);
		});

		// Обработчик отправки формы

		if (this.submitButton) {
			this.submitButton.addEventListener('click', (evt) => {
				evt.preventDefault();
				this.appState.setOrderFieldContacts('email', this.emailInput.value);
				this.appState.setOrderFieldContacts('phone', this.phoneInput.value);

				

				this.events.emit('order:submit', this.appState.order);
			});
		}
	}

	// Устанавливаем значение почты

	set email(value: string) {
		this.emailInput.value = value;
	}

	// Устанавливаем значение номер телефона

	set phone(value: string) {
		this.phoneInput.value = value;
	}
}
