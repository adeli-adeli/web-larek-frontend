import { ProductView } from './view/ProductView';

export function handleClickProductCard(
	event: MouseEvent,
	productView: ProductView
) {
	productView.events.emit('product:select', { id: productView.id });
}

export function handleClickAddToBasket(
	event: MouseEvent,
	productView: ProductView
) {
	productView.events.emit('card:add', { id: productView.id });
	const isInBasket = true;
	productView.setButton(isInBasket);
}

export function handleClickRemoveFromBasket(
	event: MouseEvent,
	productView: ProductView
) {
	productView.events.emit('card:remove', { id: productView.id });
}
