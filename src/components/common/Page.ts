import { ensureElement } from "../../utils/utils";
import { Component } from "../base/Component";
import { IEvents } from "../base/events";


interface IPage {
	counter: number;
	catalog: HTMLElement[];
	locked: boolean;
}

export class Page extends Component<IPage> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;
	protected _wrapper: HTMLElement;
	protected _basket: HTMLElement;

	constructor(container: HTMLElement, protected events: IEvents) {
		super(container);

		this._counter = ensureElement<HTMLElement>('.header__basket-counter');
		this._wrapper = ensureElement<HTMLElement>('.page__wrapper');
		this._basket = ensureElement<HTMLElement>('.header__basket');

		//  Обработчик для открытия корзины
		this._basket.addEventListener('click', () => {
			this.events.emit('basket:open');
		});
	}

	// Устанавливает значение счетчика товаров в корзине

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	// Устанавливает список товаров в каталог

	set catalog(products: HTMLElement[]) {
		this.container.replaceChildren(...products);
	}

	// Устанавливает блокировку на прокрутку страницы

	set locked(value: boolean) {
		if (value) {
			this._wrapper.classList.add('page__wrapper_locked');
		} else {
			this._wrapper.classList.remove('page__wrapper_locked');
		}
	}
}
