import { ProductCard } from "../components/model/CatalogModel";

export interface IProduct {
	id: string;
	description?: string;
	title: string;
	image: string;
	category: string;
	price: number | null;
}

export type TPayment = 'card' | 'cash';

export interface IOrderForm {
	payment?: TPayment;
	address?: string;
	email?: string;
	phone?: string;
}

export interface IOrder extends IOrderForm {
	items: IProduct[];
	total?: number;
}

export interface IOrderResponse {
	id: string;
	total?: number;
}

export interface ICatalogModel {
	catalog: IProduct[];
	preview: string | null;
	setCatalog(products: IProduct[]): void;
	setPreview(product: ProductCard): void;
}

export interface IBasketModel {
	basket: IBasketItem[];
	addToBasket(product: IProduct): void;
	removeFromBasket(productId: string): void;
	getBasket(): IProduct[];
	getTotalPrice(): number;
	clearBasket(): void;
}

export interface IBasketItem extends IProduct {
	quantity: number;
}

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
