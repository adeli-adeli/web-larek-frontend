import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { IProduct } from '../../types';
import { CATEGORY_STYLE, DEFAULT_CATEGORY_STYLE } from '../../utils/constants';

export class ProductView extends Component<IProduct> {
	protected productCardCategory?: HTMLElement;
	protected productCardTitle: HTMLElement;
	protected productCardImage?: HTMLImageElement;
	protected productCardPrice: HTMLElement;
	protected productCardDescription?: HTMLElement;
	protected addToProductButton: HTMLButtonElement;
	protected itemIndex: HTMLElement;

	events: IEvents;

	constructor(
		protected container: HTMLElement,
		events: IEvents,
		callback: (evt: MouseEvent, product: ProductView) => void
	) {
		super(container);
		this.events = events;

		this.productCardCategory = this.container.querySelector(
			`.card__category`
		) as HTMLElement;
		this.productCardTitle = this.container.querySelector(
			`.card__title`
		) as HTMLElement;
		this.productCardImage = this.container.querySelector(
			`.card__image`
		) as HTMLImageElement;
		this.addToProductButton = this.container.querySelector(
			'.button__basket'
		) as HTMLButtonElement;
		this.itemIndex = this.container.querySelector(
			'.basket__item-index'
		) as HTMLElement;

		this.productCardDescription = this.container.querySelector('.card__text');

		this.productCardPrice = this.container.querySelector(`.card__price`);

		this.container.addEventListener('click', (evt) => {
			callback(evt, this);
		});
	}

	set id(id: string) {
		this.container.dataset.id = id;
	}

	get id() {
		return this.container.dataset.id || '';
	}

	set category(category: string) {
		if (!this.productCardCategory) {
			return;
		}

		const style = CATEGORY_STYLE[category] || DEFAULT_CATEGORY_STYLE['default'];

		this.setText(this.productCardCategory, category);

		if (style) {
			this.productCardCategory.classList.add(style);
		}
	}

	get category() {
		return this.productCardCategory.textContent || '';
	}

	set title(title: string) {
		this.setText(this.productCardTitle, title);
	}

	get title() {
		return this.productCardTitle.textContent || '';
	}

	set image(image: string) {
		this.setImage(this.productCardImage, image, this.title);
	}

	set price(price: string) {
		this.setText(this.productCardPrice, price);
	}

	get price() {
		return this.productCardPrice.textContent || '';
	}

	set description(description: string) {
		this.setText(this.productCardDescription, description);
	}

	get description() {
		return this.productCardDescription.textContent || '';
	}

	// меняет состояние кнопки
	setButton(isInBasket: boolean, isFree = false) {
		if (!this.addToProductButton) return;

		if (isFree) {
			this.setDisabled(this.addToProductButton, true);
			this.setText(this.addToProductButton, 'Недоступен для заказа');
		} else {
			this.setDisabled(this.addToProductButton, isInBasket);
			this.setText(
				this.addToProductButton,
				isInBasket ? 'Уже в корзине' : 'Добавить в корзину'
			);
		}
	}

	// устанавливает нумерацию для товара
	setIndex(index: number) {
		if (index) {
			this.setText(this.itemIndex, `${index}`);
		}
	}
	render(
		product: Partial<IProduct>,
		isInBasket = false,
		indexId = 0
	): HTMLElement {
		this.id = product.id;
		this.title = product.title;
		this.image = product.image;
		this.category = product.category;
		this.description = product.description;

		const isFree = product.price === null;
		this.price = !isFree ? `${product.price} синапсов` : 'Бесценно';

		this.setButton(isInBasket, isFree);
		this.setIndex(indexId);
		return this.container;
	}
}
