import { IBasketItem, IBasketModel, IProduct } from '../../types';
import { IEvents } from '../base/events';

export class BasketModel implements IBasketModel {
	basket: IBasketItem[] = [];

	constructor(protected events: IEvents) {
		this.events = events;
	}

	// добавление товара
	addToBasket(product: IProduct): void {
		const element = this.basket.find((item) => item.id === product.id);

		if (element) {
			element.quantity += 1;
		} else {
			this.basket.push({ ...product, quantity: 1 });
		}

		this.events.emit('basket:updated');
	}

	// удаление товара
	removeFromBasket(productId: string): void {
		this.basket = this.basket.filter((product) => product.id !== productId);
		this.events.emit('basket:updated');
	}

	// получение товаров в корзине
	getBasket(): IProduct[] {
		return this.basket;
	}

	// получение товара по id
	getBasketId(): string[] {
		return this.basket.map((item) => item.id);
	}

	// получение общей стоимости товаров в корзине
	getTotalPrice(): number {
		return this.basket.reduce((total, product) => total + product.price, 0);
	}

	// очистка корзины
	clearBasket(): void {
		this.basket = [];
		this.events.emit('basket:clear');
	}

	// проверяем есть ли товар в корзине
	isInBasket(productId: string): boolean {
		return this.basket.some((item) => item.id === productId);
	}
}
