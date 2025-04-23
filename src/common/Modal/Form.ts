import { ensureElement } from '../../utils/utils';
import { Component } from '../../components/base/Component';
import { IEvents } from '../../components/base/events';

interface IFormState {
	valid: boolean;
}

export class Form<T> extends Component<IFormState> {
	protected _submit: HTMLButtonElement;

	constructor(protected container: HTMLFormElement, protected events: IEvents) {
		super(container);

		this._submit = ensureElement<HTMLButtonElement>(
			'button[type=submit]',
			this.container
		);

		this.container.addEventListener('input', (e: Event) => {
			const target = e.target as HTMLInputElement;
			const field = target.name as keyof T;
			const value = target.value;
			this.onInputChange(field, value);
			this.checkValidity()
		});
	}

	// обрабатывает изменение значения в поле ввода и эмитит соответствующее событие
	protected onInputChange(field: keyof T, value: string) {
		this.events.emit(`${this.container.name}.${String(field)}: change`, {
			field,
			value,
		});
	}

	// проверяет, что все импуты заполнены 
	checkValidity(): void {
		const allInputsFilled = Array.from(this.container.elements).filter(
			(el): el is HTMLInputElement => el instanceof HTMLInputElement
		).filter((el) => el.type !== 'submit')
		.every((input) => input.value.trim() !== "")

		this.valid = allInputsFilled
	}

	// устанавливает состояние кнопки отправки: отключает, если форма невалидна
	set valid(value: boolean) {
		this._submit.disabled = !value;
	}

	render(state: Partial<T> & IFormState) {
		const { valid, ...inputs } = state;
		super.render({ valid });
		Object.assign(this, inputs);
		return this.container;
	}
}
