import { IBasketItem, IBasketModel, IProduct } from '../../types';
import { IEvents } from '../base/events';

export class BasketModel implements IBasketModel {
	basket: IBasketItem[] = [];
	protected events: IEvents;

	constructor(events: IEvents) {
		this.events = events;
	}

	// Добавление товара
	addToBasket(product: IProduct): void {
		const element = this.basket.find((item) => item.id === product.id);

		if (element) {
			element.quantity += 1;
		} else {
			this.basket.push({ ...product, quantity: 1 });
		}

		this.events.emit('basket:updated');
	}

	// Удаление товара
	removeFromBasket(productId: string): void {
		this.basket = this.basket.filter((product) => product.id !== productId);
		this.events.emit('basket:updated');
	}

	// Получение товаров в корзине
	getBasket(): IProduct[] {
		return this.basket;
	}

	// Получение общей стоимости товаров в корзине
	getTotalPrice(): number {
		return this.basket.reduce((total, product) => total + product.price, 0);
	}

	// Очистка корзины
	clearBasket(): void {
		this.basket = [];
		this.events.emit('basket:cleared');
	}
}
