import Context from '../Context';
import Effect from './Effect';


export default class Panner extends Effect {
	_pan = 0


	constructor( pan = 0 ) {
		super();
		this._pan = pan;
		Context.onInit( () => {
			this.pan = this._pan;
		});
	}


	mount( src ) {
		if ( !this.isConnected( src ) ) {
			const node = Context.context.createStereoPanner();
			node.pan.value = this._pan;

			return super.mount( src, node );
		}
		return src;
	}


	set pan( val ) {
		this._pan = val;
		this.nodes.forEach( ( n ) => {
			n.effectNode.pan.value = val;
		});
	}


	get pan() {
		return this._pan;
	}
}
