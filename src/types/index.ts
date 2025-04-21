export interface IProduct {
	id: string;
	description?: string;
	title: string;
	image: string;
	category: string;
	price: number | null;
}

export interface IOrderForm {
	payment?: 'card' | 'cash';
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

export interface IAppState {
    catalog: IProduct[]
    basket: string[]
    preview: string | null
    order: IOrder
	// дописать методы

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
