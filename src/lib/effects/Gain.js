import Context from '../Context';
import Effect from './Effect';
import ParamProxy from './ParamProxy';


export default class Gain extends Effect {
	constructor( gain = 1 ) {
		super();

		this._gain = new ParamProxy({
			prop: 'gain',
			value: gain,
			nodes: this.nodes,
		});
	}


	mount( src ) {
		if ( !this.isConnected( src ) ) {
			const node = Context.context.createGain();
			node.gain.value = this._gain.value;

			return super.mount( src, node );
		}
		return src;
	}


	set gain( val ) {
		this._gain.set( val );
	}


	get gain() {
		return this._gain.value;
	}
}
