import {
	ICatalogModel,
	IProduct,
} from '../../types';
import { IEvents } from '../base/events';
import { Model } from '../base/Model';

export class ProductCard extends Model<IProduct> {
	id: string;
	title: string;
	price: number;
	description: string;
	image: string;
	category: string;

	constructor(data: IProduct, events: IEvents) {
		super(data, events);
		Object.assign(this, data);
	}
}

export class CatalogModel extends Model<ICatalogModel> {
	catalog: ProductCard[] = [];
	preview: string | null;
	

	//  Устанавливаем товар в каталог и обновляем отображение
	setCatalog(products: IProduct[]) {
		this.catalog = products.map((item) => new ProductCard(item, this.events));
		this.events.emit('products:changed', { catalog: this.catalog });
	}

	//  Устанавливаем товар для предварительного просмотра
	setPreview(product: ProductCard) {
		this.preview = product.id;
		this.events.emit('preview:changed', product);
	}
}
