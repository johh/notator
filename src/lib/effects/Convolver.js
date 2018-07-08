import Context from '../Context';
import Effect from './Effect';


export default class Convolver extends Effect {
	constructor({
		ir = null,
		normalize = true,
	} = {}) {
		if ( !ir ) {
			throw new Error( 'No impulse response specified.' );
		}
		super();

		fetch( ir )
			.then( response => response.arrayBuffer() )
			.then( buffer => Context.context.decodeAudioData( buffer ) )
			.then( ( audio ) => {
				this.ir = audio;
				// this.sourceNode = Context.context.createBufferSource();
				// this.sourceNode.buffer = audio;
				// this.sourceNode.loop = true;

				// this.gainNode = Context.context.createGain();
				// this.sourceNode.connect( this.gainNode );

				// this.play();
				this.loaded = true;
			})
			.catch( e => console.error( `Failed to load "${ir}"`, e ) );

		this.normalize = normalize;
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
