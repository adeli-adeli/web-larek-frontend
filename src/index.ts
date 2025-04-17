import { ProductsContainer } from './components/view/ProductsContainer';
import { ProductView } from './components/view/ProductView';
import { AppApi } from './components/AppApi';
import { EventEmitter, IEvents } from './components/base/events';
import './scss/styles.scss';
import { IProduct } from './types';
import { API_URL, CDN_URL } from './utils/constants';
import { cloneTemplate, ensureElement } from './utils/utils';
import { AppState } from './components/AppData';
import { Modal } from './common/Modal/Modal';

const events: IEvents = new EventEmitter();
const api = new AppApi(CDN_URL, API_URL);
const appState = new AppState({}, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);

const successTemplate = ensureElement<HTMLTemplateElement>('#success');
const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const orderTemplate = ensureElement<HTMLTemplateElement>('#order');
const contactsTemplate = ensureElement<HTMLTemplateElement>('#contacts');

const productsContainer = new ProductsContainer(
	ensureElement<HTMLElement>('.gallery')
);



// Обрабатываем событие, которое срабатывает после загрузки данных о товарах
events.on('products:changed', () => {
	const productsArray = appState.catalog.map((product) => {
		const productInstant = new ProductView(
			cloneTemplate(cardCatalogTemplate),
			events
		);
		return productInstant.render(product);
	});
	productsContainer.render({ catalog: productsArray });
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
		events
	);
	// Рендерим товар в модальном окне
	modal.render({
		content: productPreview.render({
			title: product.title,
			price: product.price,
			description: product.description,
			category: product.category,
			image: product.image,
		}),
	});
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