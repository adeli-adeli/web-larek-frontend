import { ProductView } from "./view/ProductView";

export function handleClickProductCard(event: any, productView: ProductView) {
	// console.log('Событие 1', event.target); // Логируем, кто был кликнут
	productView.events.emit('product:select', { id: productView.id });
}

export function handleClickAddToBasket(event: any, productView: ProductView) {
	// console.log('Событие 2', event.target); // Логируем, кто был кликнут
	productView.events.emit('card:add', { id: productView.id });
}

export function handleClickRemoveFromBasket(event: any, productView: ProductView) {
	// console.log('Событие 3', event.target); // Логируем, кто был кликнут
	
	productView.events.emit('card:remove', { id: productView.id });
}
