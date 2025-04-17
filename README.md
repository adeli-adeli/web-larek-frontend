# Проектная работа "Веб-ларек"

Стек: HTML, SCSS, TS, Webpack

Структура проекта:

- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:

- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск

Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```

## Сборка

```
npm run build
```

или

```
yarn build
```

## Архитектура приложения

Код приложения разделен на слои согласно парадигме MVP:

- слой данных, отвечает за хранение и изменение данных,
- слой представление, отвечает за отображения данных на странице,
- презентер, отвечает за связь представления и слоя данных

### Базовый код

#### Класс Api

Содержит в себе базовую логику отправки запросов. В конструктор передается базовый адрес сервера и опциональный объект с заголовками запросов.
Методы:

- `get` - выполняет GET запрос на переданный в параметрах ендпоинт и возвращает промис с объектом, которым ответил сервер
- `post` - принимает объект с данными, которые будут переданы в JSON в теле запроса, и отправляет эти данные на ендпоинт переданный как параметр при вызове метода. По умолчанию выполняется `POST` запрос, но метод запроса может быть переопределен заданием третьего параметра при вызове.

#### Класс EventEmitter

Брокер событий позволяет отправлять события и подписываться на события, происходящие в системе. Класс используется в презентере для обработки событий и в слоях приложения для генерации событий.  
Основные методы, реализуемые классом описаны интерфейсом `IEvents`:

- `on` - подписка на событие
- `emit` - инициализация события
- `trigger` - возвращает функцию, при вызове которой инициализируется требуемое в параметрах событие

#### Класс Component

Представляет собой базовый абстрактный компонент, предназначенный для работы с DOM в веб-приложениях.

Свойства:

- protected readonly container: HTMLElement - Корневой DOM-элемент

Конструктор:

- constructor(protected readonly container: HTMLElement)

Методы:

- toggleClass(element: HTMLElement, className: string, force?: boolean): : void - Переключить класс
- protected setText(element: HTMLElement, value: unknown): void - Установить текстовое содержимое
- setDisabled(element: HTMLElement, state: boolean): void - Сменить статус блокировки
- protected setHidden(element: HTMLElement): void - Скрыть
- protected setVisible(element: HTMLElement): void - Показать
- protected setImage(element: HTMLImageElement, src: string, alt?: string): void - Установить изображение с альтернативным текстом
- render(data?: Partial<T>): HTMLElement - Вернуть корневой DOM-элемент

#### Класс Model

Представляет собой базувую модель, чтобы можно было отличить ее от простых объектов с данными

Свойства:

- protected events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных

Конструктор:

- constructor(data: Partial<T>, protected events: IEvents)

Методы:

- emitChanges(event: string, payload?: object) - сообщает всем что модель поменялась

### СЛОЙ ДАННЫХ

#### Класс CatalogModel

Класс отвечает за хранение и логику работы с данными товара.\
Конструктор класса принимает инстант брокера событий\

Свойства:

- protected \_products: IProduct[] - массив объектов товара
- protected \_selectProduct: IProduct - выбрать товар
- protected events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных

Конструктор:

- constructor(events: IEvents)

Методы:

- get products: IProduct[] - получение данных товаров
- set products(product: IProduct[]) - сохранение данных товаров
- getProduct(productId: string): IProduct - возвращает товар по ее id
- getSelectProduct(): IProduct - получение текущего выбранного товара
- setSelectProduct(productId: string): IProduct - устанавливает выбраный товар

#### Класс UserModel

Отвечает за хранение и логику работы с данными пользователя.\
Конструктор принимает экземпляр брокера событий.\

Свойства:

- protected payment: string - выбор оплаты
- protected address: string - адресс доставки
- protected email: string - почта
- protected phone: string - номер телефона
- protected events: IEvents - это экземпляр класса `EventEmitter`, который будет использоваться для отправки событий при изменении данных

Конструктор:

- constructor(events: IEvents)

Методы:

- getUserInfo(): IOrderForm - получение данных пользователя
- setUserInfo(userData: IOrderForm): void - сохраняет данные пользователя в классе
- ValidationPaymentInfo(data: Record<keyof TUserPaymentInfo, string>): Partial<Record<keyof TUserPaymentInfo, string>> - проверяет объект платежной информацией пользователя на валидность
- ValidationUserInfo(data: Record<keyof IOrderForm, string>): Partial<Record<keyof IOrderForm, string>> - проверяет объект с данными пользователя на валидность

#### Класс BasketModel

Отвечает за хранение и логику работы с данными товаров в корзине.\
Конструктор принимает экземпляр брокера событий.\

Свойства:

- protected products: IProduct[] - массив объектов товара
- protected user: IOrderForm - данные пользователя для оформления заказа
- protected events: IEvents - это экземпляр класса `EventEmitter`, который будет использоваться для отправки событий при изменении данных.

Конструктор:

- constructor(events: IEvents)

Методы:

- addToBasket(product: IProduct): void - добавление товара в корзину
- removeFromBasket(productId: string): void - удаление товара с корзины
- getBasket(): IProduct[] - получение текущего состояния корзины
- getTotalPrice(): number - получение общей стоимости всех товаров
- clearBasket(): void - очистить корзину

#### Класс OrderModel

Отвечает за хранение и логику работы с данными заказа.\
Конструктор принимает экземпляр брокера событий.\

Свойства:

- protected basket: IBasketModel - это экземпляр класса 'BasketModel', который будет использоваться для вызовов методов
- protected events: IEvents - это экземпляр класса `EventEmitter`, который будет использоваться для отправки событий при изменении данных.

Конструктор:

- constructor(events: IEvents)

Методы:

- createOrder(user: IOrderForm): IOrder - создание заказа, используя данные пользователя и корзины.
- getOrderResponse(): IOrderResponse - возвращает информацию о заказе

### СЛОЙ ПРЕДСТАВЛЕНИЯ

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс ModalView

Реализует модальное окно.Устанавливает слушатель на клик по оверлею и кнопку-крестик для закрытие модального окна.

Свойства:

- modal: HTMLElement - элемент модального окна
- events: IEvents - это экземпляр класса `EventEmitter`, который будет использоваться для отправки событий при изменении данных.

Конструктор:

- constructor(selector: string, events: IEvents)

Методы:

- openModal(): void - открыть модальное окно
- closeModal(): void - закрыть модальное окно
- setUpEvents(): void - установить события

#### Класс ProductView

Класс используется для отображения карточек товаров на странице.

Элементы разметки: название, изображения, категория, цена, описание.

Конструктор принимает DOM элемент темплейта, который позволяет формировать карточки с разными вариантами верстки. Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Поля класса хранят данные о разметки элементов.

Свойства:

- protected description?: HTMLElement;
- protected title: HTMLElement;
- protected image: HTMLImageElement;
- protected category: HTMLElement;
- protected price: HTMLElement;
- protected button: HTMLButtonElement

Конструктор:

- constructor(template: HTMLTemplateElement, events: IEvents)

Методы:

- setProduct(productId: IProduct): void - замолняет атрибуты элементов товара данными
- render(): HTMLElement - возвращает полностью заполненый товар и устанавливает слушатели событий
- get id - возвращает уникальный id карточки

#### Класс BasketView

Класс используется для отображения выбраных товаров в корзине.

Элементы разметки: выбранный товар, общая сумму товаров.

Конструктор принимает DOM элемент темплейта, для работы с отображением корзины. Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Свойства:

- protected items: HTMLElement;
- protected total: HTMLElement;
- protected button: HTMLButtonElement

Конструктор:

- constructor(template: HTMLTemplateElement, events: IEvents)

Методы:

- setProductCard(productId: ICard): void - замолняет список товаров
- render(): HTMLElement - возвращает полностью заполненый товар и устанавливает слушатели событий
- get id - возвращает уникальный id карточки

#### Класс OrderView

Класс используется для оформления заказа

Элементы разметки: выбор оплаты, адресс доставки.

Конструктор принимает DOM элемент темплейта, для работы с отправкой формы.Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Свойства:

- protected payment: HTMLElement;
- protected address: HTMLElement;
- protected button: HTMLButtonElement

Конструктор:

- constructor(template: HTMLTemplateElement, events: IEvents)

Методы:

- setOrder(user: IOrderForm): void - заполнять данные о заказе
- render(): HTMLElement - возвращает полностью заполненый товар и устанавливает слушатели событий

#### Класс OrderUserView

Класс используется для оформления заказа уже с данными пользователя

Элементы разметки: почта, номер.

Конструктор принимает DOM элемент темплейта, для работы с отправкой формы.Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Свойства:

- protected email: HTMLElement;
- protected phone: HTMLElement;
- protected button: HTMLButtonElement

Конструктор:

- constructor(template: HTMLTemplateElement, events: IEvents)

Методы:

- setOrderUser(user: IOrderForm): void - заполнять данные о пользователе
- render(): HTMLElement - возвращает полностью заполненый товар и устанавливает слушатели событий

#### Класс NotificationsView

Класс используется для отоброжения об успешной покупке

Элементы разметки: сумма товара.

Конструктор принимает DOM элемент темплейта, для работы с отображением уведомления.Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Свойства:

- protected productId: string;
- protected total: HTMLElement;
- protected button: HTMLButtonElement

Конструктор:

- constructor(template: HTMLTemplateElement, events: IEvents)

Методы:

- `getTotalPrice(product: IOrderResponse): void` - заполняет сумму товара
- render(): HTMLElement - возвращает полностью заполненый товар и устанавливает слушатели событий

### СЛОЙ ПРЕЗЕНТОРА

В проекте презентер реализован без выделенного класса, а его логика распределена в основном файле `index.ts`.\
Взаимодейсвие осуществляется за счет событий генерирующих с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.\
В `index.ts` сначала создаються экземпляры всех необходимых классов, а затем настраивается обработка событий.

_Список всех событий генерирующих в системе:_\
_События изменения данных (генерируются классами моделями данных)_

- "product:changed" - изменение массива товаров
- "user:changed" - изменение данных пользователя
- 'basket:cleared' - очищение корзины после заказа
- 'basket:updated' - изменение корзины
- 'order: create' - создание заказа

_События, возникающие при взаимодействие пользователя с интерфейсом(генерируется классами, отвечающими за представление)_

- "product:open" - открытие модального окна товара
- "basket:open" - открытие модального окна корзины
- "order:form:open" - открытие модального окна оплаты
- "order:contacts:open" - открытие модального окна для заполнения данных пользователем
- "order:result:show" - открытие модального окна с уведомлением


- "product:delete" - удаления товара с корзины
- "order-button:submit" - сохранение данных о выборе оплаты в модальном окне
- "contacts-button:submit" - сохранение данных пользователя для оформления заказа в модальном окне
- "design-button:submit" - сохранение данных товара в модальном окне
- "order-input:input" - ввод данных для оплаты заказа
- "contacts-input:input" - ввод данных пользователя для оформления заказа
- "modal:close" – закрытие любого модального окна
- "paymentValidation:validation" - событие, сообщающее о необходимости валидации формы оплаты
- "userValidation:validation" - событие, сообщающее о необходимости валидации формы данных пользователя
