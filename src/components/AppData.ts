import { FormErrors, IAppState, IOrder, IProduct } from '../types';
import { IEvents } from './base/events';
import { Model } from './base/Model';


// interface ProductCatalog {
//     catalog: ProductCard[]
// }

export class ProductCard extends Model<IProduct> {
	id: string;
	title: string;
	price: number;
	description: string;
	image: string;
	category: string

	constructor(data: IProduct, events: IEvents) {
		super(data, events)
		Object.assign(this, data)
	}

}


export class AppState extends Model<IAppState> {
	catalog: ProductCard[];
	basket: IProduct[];
	preview: string | null;
	order: IOrder;
	formErrors: FormErrors;

	// Добавление или удаление товара из корзины
	updateBasket(product: IProduct, isIncluded: boolean): void {
		if (isIncluded) {
			// Добавляем товар в корзину, если его нет
			if (!this.basket.some((item) => item.id === product.id)) {
				this.basket.push(product);
				this.events.emit('basket:updated');
			}
		} else {
			// Удаляем товар из корзины
			this.basket = this.basket.filter((item) => item.id !== product.id);
			this.events.emit('basket:updated');
		}
	}

    // 

	setCatalog(products: IProduct[]) {
		this.catalog = products.map((item) => new ProductCard(item, this.events));
		this.events.emit('products:changed', { catalog: this.catalog });
	}

	//  Устанавливаем товар для предварительного просмотра
	setPreview(product: ProductCard) {
		this.preview = product.id
		this.events.emit('preview:changed', product)
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
