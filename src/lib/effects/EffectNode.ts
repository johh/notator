import OperativeNode from '../OperativeNode';
import defaultContext from '../defaultContext';


export default abstract class EffectNode<T extends AudioNode> extends OperativeNode {
	public node: T;


	constructor( factory: ( ctx: AudioContext ) => T ) {
		super();

		defaultContext.ready( ( ctx ) => {
			this.node = factory( ctx );
		});
	}


	public getControllerTarget(): T {
		return this.node;
	}
}
