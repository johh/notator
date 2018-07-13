import Context from '../Context';
import Effect from './Effect';


export default class Gain extends Effect {
	_value = 1
	_smoothing = .001

	constructor( gain = 1 ) {
		super();

		if ( typeof gain === 'object' ) {
			this._value = gain.gain;
			this._smoothing = gain.smoothing;
		} else {
			this._value = parseFloat( gain );
		}

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
		if ( val !== this._value ) {
			this._value = val;
			this.nodes.forEach( ( n ) => {
				n.effectNode.gain.cancelScheduledValues( 0 );
				n.effectNode.gain.setTargetAtTime( val, 0, this._smoothing );
			});
		}
	}


	get gain() {
		return this._value;
	}
}
