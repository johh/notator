import OperativeNode, { OperativeNodeProps } from './abstracts/OperativeNode';


export default class Destination extends OperativeNode {
	constructor( props: OperativeNodeProps ) {
		super( props );

		this.context.ready( ctx => {
			this.bindNode( ctx.destination );
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
