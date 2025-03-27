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
- презентер, отвечает за связь представления и

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

### СЛОЙ ДАННЫХ

#### Класс CatalogModel

Класс отвечает за хранение и логику работы с данными товара.\
Конструктор класса принимает инстант брокера событий\
В полях класса храняться следующие данные:

- \_items: IProduct[] - массив объектов товара
- \_events: IEvents - экземпляр класса `EventEmitter` для инициализации событий при изменении данных

Так же класс предоставляет набор методов для взаимодествия с этими данными.

- getProduct(productId: string): IProduct - возвращает товар по ее id
- get items: IProduct[] - для получения данных о товарах

#### Класс UserModel

Отвечает за хранение и логику работы с данными пользователя.\
Конструктор принимает экземпляр брокера событий.\
В полях класса храняться следующие данные:

- id: string - уникальный идентификатор
- payment: string - выбор оплаты
- address: string - адресс доставки
- email: string - почта
- telephone: number - номер телефона
- events: IEvents - это экземпляр класса `EventEmitter`, который будет использоваться для отправки событий при изменении данных

Так же класс предоставляет набор методов для взаимодествия с этими данными.

- setUserInfo(userData: IUser): void - сохраняет данные пользователя в классе
- checkValidationPaymentInfo(data: Record<keyof TUserPaymentInfo, string>): boolean - проверяет объект платежной информацией пользователя на валидность
- checkValidationUserInfo(data: Record<keyof IUser, string | number>): boolean - проверяет объект с данными пользователя на валидность

#### Класс CardModel

Отвечает за хранение и логику работы с данными товаров.\
Конструктор принимает экземпляр брокера событий.\
В полях класса храняться следующие данные:

- items: ICard[] - массив объектов товара
- total: number - сумма всех товаров
- events: IEvents - это экземпляр класса `EventEmitter`, который будет использоваться для отправки событий при изменении данных

Так же класс предоставляет набор методов для взаимодествия с этими данными.

- addToCard(product: IProduct): void - добавление товара в корзину
- removeFromCard(productId: string): void - удаление товара с корзины
- getCard(): ICard[] - получение текущего состояния корзины
- getTotalPrice(): number - получение общей стоимости всех товаров
- hasPricelessItem(): boolean - проверка на бесценный товар
- updateButtonState(productId: string): void - изменяет состояние кнопки (оформления)

### СЛОЙ ПРЕДСТАВЛЕНИЯ

Все классы представления отвечают за отображение внутри контейнера (DOM-элемент) передаваемых в них данных.

#### Класс ModalView

Реализует модальное окно.Устанавливает слушатель на клик по оверлею и кнопку-крестик для закрытие модального окна.

- constructor(selector: string, events: IEvents) - конструтор который принимает селектор и экземпляр класса EventEmitter, будет использоваться для инициализации модального окна.

Поля класса:

- modal: HTMLElement - элемент модального окна
- events: IEvents - это экземпляр класса `EventEmitter`, который будет использоваться для отправки событий при изменении данных

Так же класс предоставляет набор методов для взаимодествия с этими данными.

- openModal(): void - открыть модальное окно
- closeModal(): void - закрыть модальное окно
- setUpEvents(): void - установить события

#### Класс ProductView

Класс используется для отображения карточек товаров на странице.

Элементы разметки: название, изображения, категория, цена, описание.

Конструктор принимает DOM элемент темплейта, который позволяет формировать карточки с разными вариантами верстки. Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Поля класса хранят данные о разметки элементов.
Конструтор кроме темплейта, принимает экземпляр класса EventEmitter для инициализации событий.

Методы:

- setProduct(productId: IProduct): void - замолняет атрибуты элементов товара данными
- render(): HTMLElement - возвращает полностью заполненый товар и устанавливает слушатели событий
- геттер id возвращает уникальный id карточки

#### Класс CardView

Класс используется для отображения выбраных товаров в корзине.

Элемнты разметки: выбранный товар, цена, общая сумму товаров.

Конструктор принимает DOM элемент темплейта, для работы с отображением корзины. Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Методы:

- setProductCard(productId: ICard): void - замолняет список товаров
- render(): HTMLElement - возвращает полностью заполненый товар и устанавливает слушатели событий
- геттер id возвращает уникальный id карточки

#### Класс OrderView

Класс используется для оформления заказа

Элементы разметки: выбор оплаты, адресс доставки. Также вводимые поля нужно проверять на валидность.

Конструктор принимает DOM элемент темплейта, для работы с отправкой формы.Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Методы:

- setOrder(user: IUser): void - заполнять данные о заказе
- ValidationPayment(
  data: Record<keyof TUserPaymentInfo, string>
  ): boolean - валидация вводимых полей
- render(): HTMLElement - возвращает полностью заполненый товар и устанавливает слушатели событий

#### Класс OrderUserView

Класс используется для оформления заказа уже с данными пользователя

Элементы разметки: почта, номер. Также вводимые поля нужно проверять на валидность.

Конструктор принимает DOM элемент темплейта, для работы с отправкой формы.Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Методы:

- setOrderUser(user: IUser): void - заполнять данные о пользователе
- ValidationUser(data: Record<keyof IUser, string | number>): boolean - валидация вводимых полей
- render(): HTMLElement - возвращает полностью заполненый товар и устанавливает слушатели событий

#### Класс NotificationsView

Класс используется для отоброжения об успешной покупке

Элементы разметки: сумма товара.

Конструктор принимает DOM элемент темплейта, для работы с отображением уведомления.Устанавливаем слушатели событий на интерактивные элементы, при взаимодействии с элементами генерируются события

Методы:

- `getTotalPrice(product: Partial<ICard>): void` - заполняет сумму товаров
- render(): HTMLElement - возвращает полностью заполненый товар и устанавливает слушатели событий

### СЛОЙ ПРЕЗЕНТОРА

В проекте презентер реализован без выделенного класса, а его логика распределена в основном файле `index.ts`.\
Взаимодейсвие осуществляется за счет событий генерирующих с помощью брокера событий и обработчиков этих событий, описанных в `index.ts`.\
В `index.ts` сначала создаються экземпляры всех необходимых классов, а затем настраивается обработка событий.

_Список всех событий генерирующих в системе:_\
_События, возникающие при взаимодействие пользователя с интерфейсом(генерируется классами, отвечающими за представление)_

- "product:open" - открытие модального окна товара
- "card: open" - открытие модального окна корзины
- "orderPayment: open" - открытие модального окна оплаты
- "orderData: open" - открытие модального окна для заполнения данных пользователем
- "notifications: open" - открытие модального окна с уведомлением
- "product: delete" - удаления товара с корзины
- "order-button: submit" - сохранение данных о выборе оплаты в модальном окне
- "contacts-button: submit" - сохранение данных пользователя для оформления заказа в модальном окне
- "design-button: submit" - сохранение данных товара в модальном окне
- "order-input: input" - ввод данных для оплаты заказа
- "contacts-input: input" - ввод данных пользователя для оформления заказа
- "modal: close" – закрытие любого модального окна
- "paymentValidation: validation" - событие, сообщающее о необходимости валидации формы оплаты
- "userValidation: validation" - событие, сообщающее о необходимости валидации формы данных пользователя
