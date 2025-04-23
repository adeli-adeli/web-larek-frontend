import { IApi, IProduct, IOrderForm, IOrderResponse } from '../../types';
import { Api, ApiListResponse } from '../base/api';

export class AppApi extends Api implements IApi {
	readonly cdn: string;

	constructor(cdn: string, baseUrl: string) {
		super(baseUrl);
		this.cdn = cdn;
	}


	getProductList(): Promise<IProduct[]> {
		return this.get(`/product`).then((data: ApiListResponse<IProduct>) =>
			data.items.map((item) => ({
				...item,
				image: this.cdn + item.image,
			}))
		);
	}

	orderProducts(order: IOrderForm): Promise<IOrderResponse> {
		return this.post(`/order`, order).then((data: IOrderResponse) => data);
	}
}
