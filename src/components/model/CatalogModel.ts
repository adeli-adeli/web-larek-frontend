import { ICatalogModel, IProduct } from '../../types';
import { Model } from '../base/Model';

export class CatalogModel extends Model<ICatalogModel> {
	protected catalog: IProduct[] = [];
	protected preview: string | null;

	//  устанавливает товар в каталог и обновляем отображение
	setCatalog(products: IProduct[]) {
		this.catalog = products;
		this.events.emit('products:changed', { catalog: this.catalog });
	}

	//  устанавливает товар для предварительного просмотра
	setPreview(product: IProduct) {
		this.preview = product.id;
		this.events.emit('preview:changed', product);
	}

	//  возвращает товар, выбранный для предварительного просмотра
	getPreviewProduct(): IProduct {
		return this.catalog.find((p) => p.id === this.preview);
	}

	// возвращает каталог товара
	getCatalog(): IProduct[] {
		return this.catalog;
	}
}
