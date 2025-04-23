import { IOrder } from '../../types';
import { IEvents } from '../base/events';
import { Model } from '../base/Model';
import { BasketModel } from './BasketModel';

export class OrderModel extends Model<IOrder> {
	order: IOrder = {
		payment: 'card',
		address: '',
		email: '',
		phone: '',
		items: [],
		total: 0,
	};

	constructor(protected events: IEvents, protected basketModel: BasketModel) {
		super({} as IOrder, events);
	}

	// добавляем те поля данных которые еще не были добавлены
	setOrderData(order: Partial<IOrder>) {
		this.order = { ...this.order, ...order };
	}
}
