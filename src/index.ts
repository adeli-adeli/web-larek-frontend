import { ProductView } from './components/view/ProductView';
import { AppApi } from './components/model/AppApi';
import { EventEmitter, IEvents } from './components/base/events';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { CatalogModel } from './components/model/CatalogModel';
import { Modal } from './common/Modal/Modal';
import { Page } from './common/Modal/Page';
import { BasketView } from './components/view/BasketView';
import {
	handleClickAddToBasket,
	handleClickProductCard,
	handleClickRemoveFromBasket,
} from './components/Callbacks';
import { OrderView } from './components/view/OrderView';
import { ContactsView } from './components/view/ContactsView';
import { SuccessView } from './components/view/SuccessView';
import { BasketModel } from './components/model/BasketModel';
import { OrderModel } from './components/model/OrderModel';

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
const catalogModel = new CatalogModel({}, events);
const basketModel = new BasketModel(events);
const orderModel = new OrderModel(events);

// Глобальные контейнеры
const page = new Page(ensureElement<HTMLElement>('.gallery'), events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const basket = new BasketView(cloneTemplate(basketTemplate), events);
const contacts = new ContactsView(
	cloneTemplate(contactsTemplate),
	events,
	orderModel
);
const order = new OrderView(cloneTemplate(orderTemplate), events, orderModel);

// Обрабатываем событие, которое срабатывает после загрузки данных о товарах
events.on('products:changed', () => {
	page.catalog = catalogModel.getCatalog().map((product) => {
		const productInstant = new ProductView(
			cloneTemplate(cardCatalogTemplate),
			events,
			handleClickProductCard
		);
		return productInstant.render(product);
	});

	// Обновляем счетчик корзины
	page.counter = basketModel.getBasket().length;
});

// Подписка на событие выбора товара
events.on('product:select', ({ id }: { id: string }) => {
	// Получаем товар по id из catalog
	const productId = catalogModel.getCatalog().find((item) => item.id === id);

	if (productId) {
		// Передаем найденный товар в метод setPreview
		catalogModel.setPreview(productId);
	}
});

// Обрабатываем событие, которое обновляет товар для предварительного просмотра
events.on('preview:changed', () => {
	const product = catalogModel.getPreviewProduct();
	if (!product) return;

	const productPreview = new ProductView(
		cloneTemplate(cardPreviewTemplate),
		events,
		handleClickAddToBasket
	);

	// Рендерим товар в модальном окне
	modal.render({
		content: productPreview.render(product),
	});
});

// Добавление товара
events.on('card:add', ({ id }: { id: string }) => {
	const product = catalogModel.getCatalog().find((item) => item.id === id);

	if (product) {
		basketModel.addToBasket(product);
	}

	modal.close();
});

//  Удаление товара
events.on('card:remove', ({ id }: { id: string }) => {
	basketModel.removeFromBasket(id);
});

//  Обрабатываем событие, которое обновляет корзину при добавление или удаление товара
events.on('basket:updated', () => {
	const items = basketModel.getBasket();
	const total = basketModel.getTotalPrice();
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

// Открыть форму заказа
events.on('order:form:open', () => {
	modal.render({
		content: order.render({
			payment: 'card',
			address: '',
			valid: false,
			errors: [],
		}),
	});
});

// Открыть форму контакты
events.on('order:form:submit', () => {
	modal.render({
		content: contacts.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Отправлена форма заказа
events.on('order:submit', () => {
	console.log(order);
	console.log('Текущее состояние заказа:', orderModel.order);

	api
		.orderProducts(orderModel.order)
		.then((result) => {
			const success = new SuccessView(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
					basketModel.clearBasket();
					events.emit('order:change');
				},
			});

			modal.render({
				content: success.render({ total: result.total }),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});

// Открыть корзину
events.on('basket:open', () => {
	const items = basketModel.getBasket();
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
		catalogModel.setCatalog(initialProduct);
	})
	.catch((err) => {
		console.log(err);
	});
