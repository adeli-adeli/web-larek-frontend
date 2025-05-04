import { Component } from '../components/base/Component';
import { IEvents } from '../components/base/events';
import { ensureElement } from '../utils/utils';

interface IModelData {
	content: HTMLElement;
}

export class Modal extends Component<IModelData> {
	protected _closeButton: HTMLButtonElement;
	protected _content: HTMLElement;

	constructor(protected container: HTMLElement, protected events: IEvents) {
		super(container);

		this._closeButton = ensureElement<HTMLButtonElement>(
			'.modal__close',
			container
		);
		this._content = ensureElement<HTMLElement>('.modal__content', container);

		this._closeButton.addEventListener('click', this.close.bind(this));
		this.container.addEventListener('click', this.close.bind(this));
		this._content.addEventListener('click', (event) => event.stopPropagation());
	}

	set content(content: HTMLElement) {
		this._content.replaceChildren(content);
	}

	open() {
		this.container.classList.add('modal_active');
		this.events.emit('modal:open');
	}

	close() {
		this.container.classList.remove('modal_active');
		this._content.replaceChildren();
		this.events.emit('modal:close');
	}

	render(data: IModelData): HTMLElement {
		super.render(data);
		this.open();
		return this.container;
	}
}
