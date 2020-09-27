import OperativeNode, { OperativeNodeProps } from '../abstracts/OperativeNode';


export default abstract class EffectNode<T extends AudioNode> extends OperativeNode {
	public node: T;

	constructor( factory: ( ctx: AudioContext ) => T, props: OperativeNodeProps ) {
		super( props );

		this.context.ready( ( ctx ) => {
			this.bindNode( factory( ctx ) );
		});
	}


	public getControllerTarget(): T {
		return this.node;
	}
}
