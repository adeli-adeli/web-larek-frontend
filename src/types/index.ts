export interface IProduct {
	id: string;
	description?: string;
	title: string;
	image: string;
	category: string;
	price: number | null;
}

export interface IUser {
	payment: string;
	address: string;
	email: string;
	phone: string;
}

export interface IOrder extends IUser {
	total: number;
	items: IProduct[];
}

export interface IOrderResponse {
	id: string;
	total: number;
}

export interface ICatalogModel {
	items: IProduct[];
	getProduct(productId: string): IProduct;
	setProducts(product: IProduct[]): void;
}

export interface IUserModel {
	setUserInfo(userData: IUser): void;
	checkValidationPaymentInfo(
		data: Record<keyof TUserPaymentInfo, string>
	): boolean;
	checkValidationUserInfo(data: Record<keyof IUser, string>): boolean;
}

export interface IBasketModel {
	items: IProduct[];
	addToBasket(product: IProduct): void;
	removeFromBasket(productId: string): void;
	getBasket(): IProduct[];
	getTotalPrice(): number;
	hasPricelessItem(): boolean;
	updateButtonState(productId: string): void;
}

export type TUserPaymentInfo = Pick<IUser, 'payment' | 'address'>;
export type TUserInfo = Pick<IUser, 'email' | 'phone'>;

export interface ModalView {
	openModal(): void;
	closeModal(): void;
	setUpEvents(): void;
}

export interface ProductView {
	setProduct(productId: IProduct): void;
}

export interface BasketView {
	setProductBasket(productId: IProduct): void;
}

export interface OrderView {
	setOrder(user: IUser): void;
}

export interface OrderUserView {
	setOrderUser(user: IUser): void;
}

export interface NotificationsView {
	getTotalPrice(product: IOrderResponse): void;
}
