import { Component } from '../base/Component';
import { IEvents } from '../base/events';
import { IProduct } from '../../types';
import { ensureElement } from '../../utils/utils';

export class ProductView extends Component<IProduct> {
	protected productCardCategory?: HTMLElement;
	protected productCardTitle: HTMLElement;
	protected productCardImage?: HTMLImageElement;
	protected productCardPrice: HTMLElement;
	protected productCardDescription?: HTMLElement;
	protected addToBasketButton: HTMLButtonElement;
	protected removeFromBasketButton: HTMLButtonElement;
	 events: IEvents;

	constructor(protected container: HTMLElement, events: IEvents, callback: any) {
		super(container);
		this.events = events;

		this.productCardCategory = container.querySelector(
			`.card__category`,
			
		);
		this.productCardTitle = container.querySelector(
			`.card__title`,
			
		);
		this.productCardImage = container.querySelector(
			`.card__image`,
			
		);

		this.productCardDescription = container.querySelector('.card__text');

		this.productCardPrice = container.querySelector(
			`.card__price`,
			
		);

		
		
		
		this.container.addEventListener('click', (evt) => {
			callback(evt, this)
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

	render(product: Partial<IProduct>): HTMLElement {
		this.id = product.id;
		this.title = product.title;
		this.image = product.image;
		this.category = product.category;
		this.description = product.description;
		this.price = product.price ? `${product.price} синапсов` : 'Бесценно';
		
		return this.container;
	}
}
