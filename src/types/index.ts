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
