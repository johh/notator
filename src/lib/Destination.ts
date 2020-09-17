import defaultContext from './defaultContext';
import OperativeNode from './OperativeNode';


export default class Destination extends OperativeNode {
	constructor() {
		super();

		defaultContext.ready( ctx => {
			this.node = ctx.destination;
		});
	}

	// eslint-disable-next-line class-methods-use-this
	public connect(): void {
		throw new Error( 'A Destination can\'t have children.' );
	}

	// eslint-disable-next-line class-methods-use-this
	public disconnect(): void {
		throw new Error( 'A Destination can\'t have children.' );
	}
}
