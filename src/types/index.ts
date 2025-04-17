export interface IProduct {
	id: string;
	description?: string;
	title: string;
	image: string;
	category: string;
	price: number | null;
}

export interface IOrderForm {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IOrder extends IOrderForm {
	products: IProduct[];
	total?: number;
}

export interface IOrderResponse {
	id: string;
	total?: number;
}

export interface ICatalogModel {
	products: IProduct[];
	getProduct(productId: string): IProduct;
	getSelectProduct(): IProduct;
	setSelectProduct(productId: string): IProduct;
}

export interface IOrderFormModel {
	getUserInfo(): IOrderForm;
	setUserInfo(userData: IOrderForm): void;
	// ValidationPaymentInfo(
	// 	data: Record<keyof IOrderForm, string>
	// ): Partial<Record<keyof IOrderForm, string>>;
	// ValidationUserInfo(
	// 	data: Record<keyof IOrderForm, string>
	// ): Partial<Record<keyof IOrderForm, string>>;
}

export interface IBasketModel {
	addToBasket(product: IProduct): void;
	removeFromBasket(productId: string): void;
	getBasket(): IProduct[];
	getTotalPrice(): number;
	clearBasket(): void;
}
export interface IAppState {
    catalog: IProduct[]
    basket: string[]
    preview: string | null
    order: IOrder
}

//ПОДУМАТЬ НАДО ЭТО ИЛИ НЕТ
export type TOrderInfo = Pick<IOrderForm, 'payment' | 'address'>;

export type TContactsInfo = Pick<IOrderForm, 'email' | 'phone'>;

export type FormErrors = Partial<Record<keyof IOrder, string>>;

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export interface IApi {
	baseUrl: string;
	get<T>(uri: string): Promise<T>;
	post<T>(uri: string, data: object, method?: ApiPostMethods): Promise<T>;
}
