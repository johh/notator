import Context from '../Context';
import Effect from './Effect';
import fetchAudio from '../utils/fetchAudio';


export default class Convolver extends Effect {
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
			this.ir = audio;
			this.loaded = true;
		});
	}


	mount( src ) {
		if ( !this.isConnected( src ) && this.loaded ) {
			const node = Context.context.createConvolver();
			node.buffer = this.ir;
			node.normalize = this.normalize;

			return super.mount( src, node );
		}
		return src;
	}
}
