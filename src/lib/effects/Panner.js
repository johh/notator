import Context from '../Context';
import Effect from './Effect';
import ParamProxy from './ParamProxy';


export default class Panner extends Effect {
	_pan = 0


	constructor( pan = 0 ) {
		super();

		this._pan = new ParamProxy({
			prop: 'pan',
			value: pan,
			nodes: this.nodes,
		});

		Context.onInit( () => {
			if ( !Context.context.createStereoPanner ) {
				console.error( 'StereoPanner is not supported by this browser.' );
				this.disabled = true;
			}
		});
	}


	mount( src ) {
		if ( !this.isConnected( src ) && Context.context.createStereoPanner ) {
			const node = Context.context.createStereoPanner();
			node.pan.value = this._pan.value;

			return super.mount( src, node );
		}
		return src;
	}


	unmount( src ) {
		if ( this.disabled ) {
			return src;
		}
		return super.unmount( src );
	}


	set pan( val ) {
		this._pan.set( val );
	}


	get pan() {
		return this._pan.value;
	}
}
