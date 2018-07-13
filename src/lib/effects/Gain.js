import Context from '../Context';
import Effect from './Effect';


export default class Gain extends Effect {
	_value = 1


	constructor( gain = 1 ) {
		super();
		this._value = gain;
		Context.onInit( () => {
			this.gain = this._value;
		});
	}


	mount( src ) {
		if ( !this.isConnected( src ) ) {
			const node = Context.context.createGain();
			node.gain.value = this._value;

			return super.mount( src, node );
		}
		return src;
	}


	set gain( val ) {
		this._value = val;
		this.nodes.forEach( ( n ) => {
			n.effectNode.gain.cancelScheduledValues( 0 );
			n.effectNode.gain.setTargetAtTime( val, 0, .001 );
		});
	}


	get gain() {
		return this._value;
	}
}
