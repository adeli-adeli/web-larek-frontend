import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export class ProductView extends Component<IProduct> {
	protected productCardCategory: HTMLElement;
	protected productCardTitle: HTMLElement;
	protected productCardImage: HTMLImageElement;
	protected productCardPrice: HTMLElement;
	protected events: IEvents;

	constructor(protected container: HTMLElement, events: IEvents) {
		super(container);
		this.events = events;

		this.productCardCategory = ensureElement<HTMLElement>(
			`.card__category`,
			container
		);
		this.productCardTitle = ensureElement<HTMLElement>(
			`.card__title`,
			container
		);
		this.productCardImage = ensureElement<HTMLImageElement>(
			`.card__image`,
			container
		);

		this.productCardPrice = ensureElement<HTMLElement>(
			`.card__price`,
			container
		);

		this.container.addEventListener('click', () => {
			this.events.emit('product:select', { id: this.id });
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

	render(product: Partial<IProduct>): HTMLElement {
		this.id = product.id;
		this.title = product.title;
		this.image = product.image;
		this.category = product.category;
		this.price = product.price ? `${product.price} синапсов` : 'Бесценно';
		console.log(product.image);
		return this.container;
	}
}
