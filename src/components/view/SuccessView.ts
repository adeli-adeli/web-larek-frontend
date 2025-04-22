import { ensureElement } from '../../utils/utils';
import { Component } from '../base/Component';

interface ISuccess {
	total: number;
}

interface ISuccessActions {
	onClick: () => void;
}

export class SuccessView extends Component<ISuccess> {
	protected _close: HTMLElement;

	constructor(container: HTMLElement, actions: ISuccessActions) {
		super(container);

		this._close = ensureElement<HTMLElement>(
			'.order-success__close',
			this.container
		);

		if (actions?.onClick) {
			this._close.addEventListener('click', actions.onClick);
		}
	}

	render(state: ISuccess) {
		const text = ensureElement<HTMLElement>(
			'.order-success__description',
			this.container
		);
		text.textContent = `Списано ${state.total} синапсов`;
		return this.container;
	}
}
