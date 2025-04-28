import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';
import { IEvents } from '../base/events';

interface ISuccess {
	total: number;
}

export class SuccessView extends Component<ISuccess> {
	protected _close: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		this._close.addEventListener('click', () => {
			events.emit('notification:close');
		});
	}

	render(state: ISuccess) {
		const text = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		this.setText(text, `Списано ${state.total} синапсов`);
		return this.container;
	}
}
