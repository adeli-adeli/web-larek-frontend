import { IApi, IProduct, IOrderForm, IOrder, IOrderResponse } from '../types';
import { Api, ApiListResponse } from './base/api';

export class AppApi extends Api implements IApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string) {
		super(baseUrl);
		this.cdn = cdn;
	}

	getProductItem(id: string): Promise<IProduct> {
		return this.get(`/product/${id}`).then((item: IProduct) => ({
			...item,
			image: this.cdn + item.image,
		}));
	}

	getProductList(): Promise<IProduct[]> {
		return this.get(`/product`).then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	addProduct(data: IProduct): Promise<IProduct> {
		return this.post<IProduct>(`/product`, data);
	}

	removeProduct(productId: string): Promise<IProduct> {
		return this.post<IProduct>(`/product/${productId}`, {}, 'DELETE');
	}

	orderProducts(order: IOrder): Promise<IOrderResponse> {
		return this.post(`/order`, order).then((data: IOrderResponse) => data);
	}
}
