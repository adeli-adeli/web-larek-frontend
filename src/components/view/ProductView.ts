import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { IProduct } from '../../types';

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
		callback: any
	) {
		super(container);
		this.events = events;

		this.productCardCategory = this.container.querySelector(`.card__category`);
		this.productCardTitle = this.container.querySelector(`.card__title`);
		this.productCardImage = this.container.querySelector(`.card__image`);
		this.addToProductButton = this.container.querySelector('.button__basket');
		this.itemIndex = this.container.querySelector('.basket__item-index');

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
		this.setText(this.productCardCategory, category);
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
	setButton(isInBasket: boolean) {
		if (!this.addToProductButton) return;
		this.addToProductButton.disabled = isInBasket;
		this.addToProductButton.textContent = isInBasket
			? 'Уже в корзине'
			: 'Добавить в корзину';
	}

	// устанавливает нумерацию для товара
	setIndex(index: number) {
		if (index) {
			this.itemIndex.textContent = `${index}`;
		}
	}
	render(
		product: Partial<IProduct>,
		isInBasket: boolean = false,
		indexId: number = 0
	): HTMLElement {
		this.id = product.id;
		this.title = product.title;
		this.image = product.image;
		this.category = product.category;
		this.description = product.description;
		this.price = product.price ? `${product.price} синапсов` : 'Бесценно';

		this.setButton(isInBasket);
		this.setIndex(indexId);
		return this.container;
	}
}
