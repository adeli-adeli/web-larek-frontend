import { IBasketModel, IOrder, IOrderResponse, IOrderForm } from '../../types';
import { IEvents } from '../base/events';


export class OrderModel {
	protected basket: IBasketModel;
	protected events: IEvents;
	protected orderIdCounter: number = 1;

	constructor(events: IEvents, basket: IBasketModel) {
		this.events = events;
		this.basket = basket;
	}

	createOrder(user: IOrderForm): IOrder {
		const products = this.basket.getBasket();
		const total = this.basket.getTotalPrice();

		const order: IOrder = {
			...user,
			products,
			total,
		};

        this.basket.clearBasket()
        this.events.emit('order: create', order)
		return order;
	}

	getOrderResponse(): IOrderResponse {
		const total = this.basket.getTotalPrice();
		const orderId = this.orderIdCounter++;

		const orderResponse: IOrderResponse = {
			id: `order-${orderId}`,
			total,
		};

		return orderResponse;
	}
}
