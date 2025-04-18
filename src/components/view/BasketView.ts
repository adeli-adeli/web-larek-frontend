import { Component } from '../base/Component';
import { EventEmitter, IEvents } from '../base/events';
import { createElement, ensureElement } from '../../utils/utils';

interface IBasketView {
	items: HTMLElement[];
	total: number;
	added: string[];
}

export class BasketView extends Component<IBasketView> {
	protected _list: HTMLElement;
	protected _total: HTMLElement;
	protected _button: HTMLElement;
	protected _addedItems: HTMLElement;
	protected events: IEvents;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this._list = ensureElement<HTMLElement>('.basket__list', this.container);
		this._total = this.container.querySelector('.basket__price');
		this._button = this.container.querySelector('.basket__button');

		if (this._button) {
			this._button.addEventListener('click', () => {
				events.emit('order:form:open');
			});
		}

		this.items = [];
	}

	// отображает список товаров или сообщение,
	//  что корзина пуста

	set items(items: HTMLElement[]) {
		if (items.length) {
			this._list.replaceChildren(...items);
		} else {
			this._list.replaceChildren(
				createElement<HTMLParagraphElement>('p', {
					textContent: 'Корзина пуста',
				})
			);
		}
	}

	// активирует или блокирует кнопку оформления заказа,
	// в зависимости от наличия товаров
	set addedItems(items: string[]) {
		if (items.length === 0) {
			this.setDisabled(this._button, true);
		} else {
			this.setDisabled(this._button, false);
		}
	}

	//отображает общую сумму заказа
	set total(total: number) {
		this.setText(this._total, `${total}`);
	}
	
}
