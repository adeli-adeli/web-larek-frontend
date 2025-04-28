export interface IProduct {
	id: string;
	description?: string;
	title: string;
	image: string;
	category: string;
	price: number | null;
}

export interface IOrderForm {
	payment?: string;
	address?: string;
	email?: string;
	phone?: string;
}

export interface IOrder extends IOrderForm {
	items: string[];
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
	setPreview(product: IProduct): void;
	getPreviewProduct(): IProduct;
	getCatalog(): IProduct[];
}

export interface IBasketModel {
	basket: IBasketItem[];
	addToBasket(product: IProduct): void;
	removeFromBasket(productId: string): void;
	getBasket(): IProduct[];
	getBasketId(): string[];
	getTotalPrice(): number;
	clearBasket(): void;
	isInBasket(productId: string): boolean;
}

export interface IBasketItem extends IProduct {
	quantity: number;
}

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
