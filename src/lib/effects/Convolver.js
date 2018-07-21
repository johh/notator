import Context from '../Context';
import Connectable from '../Connectable';
import AudioLoader from '../utils/AudioLoader';


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

		Context.onInit( () => {
			const node = Context.context.createConvolver();
			node.normalize = this.normalize;

			this.effectNode = node;
		});

		const loader = new AudioLoader( ir );
		loader.load().then( ( audio ) => {
			this.effectNode.buffer = audio;
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
