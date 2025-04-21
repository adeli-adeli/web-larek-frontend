import { prependListener } from 'process';
import {
	FormErrors,
	IAppState,
	IOrder,
	IOrderForm,
	IProduct,
} from '../../types';
import { IEvents } from '../base/events';
import { Model } from '../base/Model';


export class ProductCard extends Model<IProduct> {
	id: string;
	title: string;
	price: number;
	description: string;
	image: string;
	category: string;

	constructor(data: IProduct, events: IEvents) {
		super(data, events);
		Object.assign(this, data);
	}
}

export interface IBasketItem extends IProduct {
	quantity: number;
}

export class AppState extends Model<IAppState> {
	catalog: ProductCard[];
	basket: IBasketItem[] = [];
	preview: string | null;
	order: IOrderForm = {
		payment: 'card',
		address: '',
		email: '',
		phone: '',
	};
	formErrors: FormErrors = {};

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

	//  Устанавливаем товар в каталог и обновляем отображение

	setCatalog(products: IProduct[]) {
		this.catalog = products.map((item) => new ProductCard(item, this.events));
		this.events.emit('products:changed', { catalog: this.catalog });
	}

	//  Устанавливаем товар для предварительного просмотра

	setPreview(product: ProductCard) {
		this.preview = product.id;
		this.events.emit('preview:changed', product);
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

	// Метод для обновления поля в объекте заказа и выполнение валидации

	setOrderField<K extends keyof IOrderForm>(field: K, value: IOrderForm[K]) {
		this.order[field] = value;

		if (this.validateOrder()) {
			this.events.emit('order:ready', this.order);
		}
		
	}
	setOrderFieldContacts<K extends keyof IOrderForm>(field: K, value: IOrderForm[K]) {
		this.order[field] = value;

		if (this.validateOrderContacts()) {
			this.events.emit('order:ready', this.order);
		}
		
	}

	// Метод для валидации доставки

	validateOrder() {
		const errors: typeof this.formErrors = {};

		if (!this.order.payment) {
			errors.payment = 'Выберите способ оплаты';
		}

		if (!this.order.address) {
			errors.address = 'Необходимо указать адрес доставки';
		} else {
			errors.address = '';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	// Метод для валидации контактов

	validateOrderContacts() {
		const errors: typeof this.formErrors = {};

		if (!this.order.email) {
			errors.email = 'Необходимо указать почту';
		} else {
			errors.email = '';
		}
		if (!this.order.phone) {
			errors.phone = 'Необходимо указать номер телефона';
		} else {
			errors.phone = '';
		}

		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);

		return Object.keys(errors).length === 0;
	}

	
}
