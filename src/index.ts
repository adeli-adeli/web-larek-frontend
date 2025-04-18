import { ProductView } from './components/view/ProductView';
import { AppApi } from './components/AppApi';
import { EventEmitter, IEvents } from './components/base/events';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppState } from './components/AppData';
import { Modal } from './common/Modal/Modal';
import { Page } from './components/Page';
import { BasketView } from './components/view/BasketView';
import {
	handleClickAddToBasket,
	handleClickProductCard,
	handleClickRemoveFromBasket,
} from './components/Callbacks';

const events: IEvents = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);

//  Все шаблоны
const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

//  Модель данных приложения
const appState = new AppState({}, events);

// Глобальные контейнеры
const page = new Page(ensureElement<HTMLElement>('.gallery'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new BasketView(cloneTemplate(basketTemplate), events);

// Обрабатываем событие, которое срабатывает после загрузки данных о товарах
events.on('products:changed', () => {
	page.catalog = appState.catalog.map((product) => {
		const productInstant = new ProductView(
			cloneTemplate(cardCatalogTemplate),
			events,
			handleClickProductCard
		);
		return productInstant.render(product);
	});

	// Обновляем счетчик корзины
	page.counter = appState.getBasket().length;
});

// Подписка на событие выбора товара
events.on('product:select', ({ id }: { id: string }) => {
	// Получаем товар по id из catalog
	const productId = appState.catalog.find((item) => item.id === id);

	if (productId) {
		// Передаем найденный товар в метод setPreview
		appState.setPreview(productId);
	}
});

// Обрабатываем событие, которое обновляет товар для предварительного просмотра
events.on('preview:changed', (product: IProduct) => {
	const productPreview = new ProductView(
		cloneTemplate(cardPreviewTemplate),
		events,
		handleClickAddToBasket
	);

	// Рендерим товар в модальном окне
	modal.render({
		content: productPreview.render({
			id: product.id,
			title: product.title,
			price: product.price,
			description: product.description,
			category: product.category,
			image: product.image,
		}),
	});
});

// Добавление товара

events.on('card:add', ({ id }: { id: string }) => {
	const product = appState.catalog.find((item) => item.id === id);

	if (product) {
		appState.addToBasket(product);
	}

	modal.close();
});

//  Удаление товара

events.on('card:remove', ({ id }: { id: string }) => {
	appState.removeFromBasket(id);
});

//  Обрабатываем событие, которое обновляет корзину при добавление или удаление товара

events.on('basket:updated', () => {
	const items = appState.getBasket();
	const total = appState.getTotalPrice();
	page.counter = items.length;

	console.log();

	const elements = items.map((product) => {
		const basketView = new ProductView(
			cloneTemplate(cardBasketTemplate),
			events,
			handleClickRemoveFromBasket
		);
		return basketView.render(product);
	});

	basket.items = elements;
	basket.total = total;
	basket.addedItems = items.map((item) => item.id);
});

// Открыть корзину

events.on('basket:open', () => {
	const items = appState.getBasket();
	basket.addedItems = items.map((item) => item.id);
	modal.render({
		content: basket.render(),
	});
});

// Очищение корзины

events.on('basket:clear', () => {
	page.counter = 0;
});

// Блокируем прокрутку страницы если открыта модалка

events.on('modal:open', () => {
	page.locked = true;
});

// ... и разблокируем

events.on('modal:close', () => {
	page.locked = false;
});

// Получаем товары с сервера

api
	.getProductList()
	.then((initialProduct) => {
		console.log(initialProduct);
		appState.setCatalog(initialProduct);
	})
	.catch((err) => {
		console.log(err);
	});
