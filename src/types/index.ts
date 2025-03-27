export interface IProduct {
	id: string;
	description?: string;
	title: string;
	image: string;
	category: string;
	price: number | null;
}

export interface IUser {
	id: string;
	payment: string;
	address: string;
	email: string;
	telephone: number;
}

export interface ICard extends IProduct {
	quantity: number;
}

export interface ICatalogModel {
	items: IProduct[];
	getProduct(productId: string): IProduct | undefined;
}

export interface IUserModel {
	setUserInfo(userData: IUser): void;
	checkValidationPaymentInfo(
		data: Record<keyof TUserPaymentInfo, string>
	): boolean;
	checkValidationUserInfo(data: Record<keyof IUser, string | number>): boolean;
}

export interface ICardModel {
	items: IProduct[];
	total: number;
	addToCard(product: IProduct): void;
	removeFromCard(productId: string): void;
	getCard(): ICard[];
	getTotalPrice(): number;
	hasPricelessItem(): boolean;
	updateButtonState(productId: string): void;
}

export type TUserPaymentInfo = Pick<IUser, 'payment' | 'address'>;
export type TUserInfo = Pick<IUser, 'email' | 'telephone'>;

export interface ModalView {
	openModal(): void;
	closeModal(): void;
	setUpEvents(): void;
}

export interface ProductView {
	setProduct(productId: IProduct): void;
	render(): HTMLElement;
}

export interface CardView {
	setProductCard(productId: ICard): void;
	render(): HTMLElement;
}

export interface OrderView {
	setOrder(user: IUser): void;
	ValidationPayment(data: Record<keyof TUserPaymentInfo, string>): boolean;
	render(): HTMLElement;
}

export interface OrderUserView {
	setOrderUser(user: IUser): void;
	ValidationUser(data: Record<keyof IUser, string | number>): boolean;
	render(): HTMLElement;
}

export interface NotificationsView {
	getTotalPrice(product: Partial<ICard>): void;
	render(): HTMLElement;
}
