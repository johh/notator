import Context from '../Context';
import Connectable from '../Connectable';
import fetchAudio from '../utils/fetchAudio';


export default class Convolver extends Connectable {
	instanced = false


	constructor({
		ir = null,
		normalize = true,
	} = {}) {
		if ( !ir ) {
			throw new Error( 'No impulse response specified.' );
		}
		super();

		this.normalize = normalize;

		fetchAudio( ir ).then( ( audio ) => {
			this.effectNode.buffer = audio;
		});

		Context.onInit( () => {
			const node = Context.context.createConvolver();
			node.normalize = this.normalize;

			this.effectNode = node;
		});
	}


	createNode( srcNode ) {
		srcNode.connect( this.effectNode );
		return this.effectNode;
	}


	removeNode( srcNode ) {
		srcNode.disconnect( this.effectNode );
		return this.effectNode;
	}
}
