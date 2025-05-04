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

Представляет собой базовую модель, чтобы можно было отличить ее от простых объектов с данными

Конструктор:

- constructor(data: Partial<T>, protected events: IEvents)

Методы:

- emitChanges(event: string, payload?: object) - сообщает всем что модель поменялась

### СЛОЙ ДАННЫХ

#### Класс CatalogModel

Наследует от базового класса Model.\
Класс отвечает за хранение и логику работы с данными товара.

Свойства:

- protected catalog: ProductCard[] - массив объектов товара
- protected preview: string | null - выбрать товар

Методы:

- setCatalog(products: IProduct[]) - устанавливает товар в каталог и обновляем отображение
- setPreview(product: IProduct) - устанавливает товар для предварительного просмотра
- getPreviewProduct(): IProduct - возвращает товар, выбранный для предварительного просмотра
- getCatalog(): IProduct[] - возвращает каталог товара

#### Класс BasketModel

Отвечает за хранение и логику работы с данными товаров в корзине.\
Конструктор принимает экземпляр брокера событий.

Свойства:

- basket: IBasketItem[] - считается количество товара, чтобы небыло дубликатов

Конструктор:

- constructor(protected events: IEvents)

Методы:

- addToBasket(product: IProduct): void - добавление товара в корзину
- removeFromBasket(productId: string): void - удаление товара с корзины
- getBasket(): IProduct[] - получение текущего состояния корзины
- getBasketId(): string[] - получение товара по id
- getTotalPrice(): number - получение общей стоимости всех товаров
- clearBasket(): void - очистить корзину
- isInBasket(productId: string): boolean - проверяем есть ли товар в корзине

#### Класс OrderModel

Наследует от базового класса Model.\
Отвечает за хранение и логику работы с данными заказа.\
Конструктор принимает экземпляр брокера событий.

Свойства:

- order: IOrder - инициализация объекта заказа с дефолтными значениями

Конструктор:

- constructor(protected events: IEvents)

Методы:

- setOrderData(order: Partial<IOrder>) - добавляем те поля данных которые еще не были добавлены
- setOrderField(field: keyof IOrderForm, value: string) - устанавливаем значение поля заказа, и запускаем валидацию
- setContactsField(field: keyof IOrderForm, value: string) - устанавливаем значение поля контактов, и запускаем валидацию
- validateOrder() - валидация данных заказа
- validateUserData() - валидация данных контакты

#### Класс AppApi

Наследует от базового класса Api.\
Класс для создания запросов.

Конструктор принимает базовую ссылку запроса

Конструктор:

- constructor(template: HTMLTemplateElement, events: IEvents)

Методы:

- getProductList(): Promise<IProduct[]> - получаем значения товаров
- orderProducts(order: IOrderForm): Promise<IOrderResponse> - отправляем созданный заказ

### СЛОЙ ПРЕДСТАВЛЕНИЯ

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс Modal

Наследует от базового класса Component.\
Реализует модальное окно. Устанавливает слушатель на клик по оверлею и кнопку-крестик для закрытие модального окна. Конструктор принимает контейнер и экземпляр брокера событий.

Свойства:

- protected \_closeButton: HTMLButtonElement - кнопка для закрытия модального окна
- protected \_content: HTMLElement - элемент модального окна

Конструктор:

- constructor(protected container: HTMLElement, protected events: IEvents)

Методы:

- сеттер content - устанавливает контент в модальное окно
- openModal(): void - открыть модальное окно
- closeModal(): void - закрыть модальное окно

#### Класс Page

Наследует от базового класса Component.\
Реализует контейнер для отображения на главной странице. Конструктор принимает контейнер и экземпляр брокера событий. Устанавливает слушатель на клик по корзине для открытия.

Свойства:

- protected \_counter: HTMLElement - количество товара в корзине
- protected \_catalog: HTMLElement - каталог товара
- protected \_wrapper: HTMLElement - прокрутка страницы
- protected \_basket: HTMLElement - корзина

Конструктор:

- constructor(protected container: HTMLElement, protected events: IEvents)

Методы:

- сеттер counter - устанавливает значение счетчика товаров в корзине
- сеттер catalog - устанавливает список товаров в каталог
- сеттер locked - устанавливает блокировку на прокрутку страницы

#### Класс Form

Наследует от базового класса Component.\
Реализует форму. Конструктор принимает контейнер и экземпляр брокера событий. Устанавливает слушатель на импут.

Свойства:

- protected \_submit: HTMLButtonElement - кнопка для отправки данных с формы
- protected \_errors: HTMLElement - элемент сообщения

Конструктор:

- constructor(protected container: HTMLElement, protected events: IEvents)

Методы:

- protected onInputChange(field: keyof T, value: string) - обрабатывает изменение значения в поле ввода и эмитит соответствующее событие
- сеттер valid - устанавливает состояние кнопки отправки: отключает, если форма невалидна
- сеттер errors - устанавливает сообщение об ошибке

#### Класс ProductView

Наследует от базового класса Component.\
Класс используется для отображения карточек товаров на странице.

Элементы разметки: название, изображения, категория, цена, описание.

Конструктор принимает контейнер, который позволяет формировать карточки с разными вариантами верстки. Устанавливаем слушатель клика и вызываем колбэк, для работы с событиями

Поля класса хранят данные о разметки элементов.

Свойства:

- protected productCardCategory?: HTMLElement
- protected productCardTitle: HTMLElement
- protected productCardImage?: HTMLImageElement
- protected productCardPrice: HTMLElement
- protected productCardDescription?: HTMLElement
- protected addToProductButton: HTMLButtonElement
- protected itemIndex: HTMLElement

Конструктор:

- constructor(protected container: HTMLElement, events: IEvents, callback: (evt: MouseEvent, product: ProductView) => void)

Методы:

- сеттеры и геттеры для установления и возращение значений
- setButton(isInBasket: boolean) - меняет состояние кнопки
- setIndex(index: number) - устанавливает нумерацию для товара

#### Класс BasketView

Наследует от базового класса Component.\
Класс используется для отображения выбранных товаров в корзине.

Элементы разметки: выбранный товар, общая сумму товаров.

Конструктор принимает контейнер, для работы с отображением корзины. Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Свойства:

- protected \_list: HTMLElement
- protected \_total: HTMLElement
- protected \_button: HTMLElement
- protected \_addedItems: HTMLElement

Конструктор:

- constructor(protected container: HTMLElement, protected events: IEvents)

Методы:

- сеттер items - отображает список товаров или сообщение, что корзина пуста
- сеттер addedItems - активирует или блокирует кнопку оформления заказа, в зависимости от наличия товаров
- сеттер total - отображает общую сумму заказа
- clear() - очищает корзину

#### Класс OrderView

Наследует от базового класса Form.\
Класс используется для оформления заказа

Элементы разметки: выбор оплаты, адрес доставки.

Конструктор принимает конструктор, для работы с отправкой формы. Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Свойства:

- protected paymentButtons: NodeListOf<HTMLButtonElement>
- protected submitButton: HTMLElement
- protected addressInput: HTMLInputElement
- protected orderModel: OrderModel

Конструктор:

- constructor(protected container: HTMLFormElement, protected events: IEvents, orderModel: OrderModel)

Методы:

- setPayment(method: 'card' | 'cash') - заполнять данные о заказе - устанавливает выбранный способ оплаты
- сеттер address - устанавливает значение адреса
- clear() - очищает форму

#### Класс ContactsView

Наследует от базового класса Form.\
Класс используется для оформления заказа уже с данными пользователя

Элементы разметки: почта, номер.

Конструктор принимает конструктор, для работы с отправкой формы. Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Свойства:

- protected submitButton: HTMLElement
- protected emailInput: HTMLInputElement
- protected phoneInput: HTMLInputElement
- protected orderModel: OrderModel

Конструктор:

- constructor(protected container: HTMLFormElement, protected events: IEvents, orderModel: OrderModel)

Методы:

- сеттер email - устанавливает значение почты
- сеттер phone - устанавливает значение номер телефон
- clear() - очищает форму

#### Класс SuccessView

Наследует от базового класса Component.\
Класс используется для отображения об успешной покупке.

Элементы разметки: сумма товара.

Конструктор принимает контейнер, для работы с отображением уведомления. Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Свойства:

Конструктор:

- constructor(template: HTMLTemplateElement, events: IEvents)

### Обработчики событий

Для взаимодействия с пользователем используются обработчики событий.
Основные взаимодействия: выбор товара, добавление товара в корзину и удаление товара из корзины.

- handleClickProductCard - обрабатывает клик по карточке товара
- handleClickAddToBasket - обрабатывает клик на кнопку добавление товара в корзину
- handleClickRemoveFromBasket - удаление товара из корзины

### СЛОЙ ПРЕЗЕНТОРА

В проекте презентер реализован без выделенного класса, а его логика распределена в основном файле `index.ts`.\
Взаимодействие осуществляется за счет событий генерирующих с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.\
В `index.ts` сначала создаются экземпляры всех необходимых классов, а затем настраивается обработка событий.

_Список всех событий генерирующих в системе:_\
_События изменения данных (генерируются классами моделями данных)_

- 'products:changed' - изменение массива товаров
- 'basket:clear' - очищение корзины после заказа
- 'basket:updated' - изменение корзины
- 'preview:changed' - изменение карточки товара
- 'formErrors:change' - отображение ошибок заказа
- 'formErrors:contacts:change' - отображение ошибок контактов

_События, возникающие при взаимодействие пользователя с интерфейсом(генерируется классами, отвечающими за представление)_

- "basket:open" - открытие модального окна корзины
- "order:form:open" - открытие модального окна оплаты
- "order:form:submit" - открытие модального окна для заполнения данных пользователем
- "order:submit" - отправка данных и открытие модального окна с уведомлением
- "modal:open" – открытие любого модального окна
- "modal:close" – закрытие любого модального окна
- "product:select" - открытие модального окна выбранной карточки
- "card:remove" - удаления товара с корзины
- "card:add" - добавление товара в корзину
- "notification:close" - закрытие модального окна на кнопку
