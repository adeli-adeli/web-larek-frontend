import { Component } from '../base/Component';

interface IProductContainer {
	counter: number;
	catalog: HTMLElement[];
}

export class ProductsContainer extends Component<IProductContainer> {
	protected _counter: HTMLElement;
	protected _catalog: HTMLElement;

	constructor(protected container: HTMLElement) {
		super(container);
	}

	set counter(value: number) {
		this.setText(this._counter, String(value));
	}

	set catalog(products: HTMLElement[]) {
		this.container.replaceChildren(...products);
	}
}
