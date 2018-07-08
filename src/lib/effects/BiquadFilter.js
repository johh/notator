import Context from '../Context';
import Effect from './Effect';


export default class BiquadFilter extends Effect {
	constructor({
		frequency = 440,
		Q = 1,
		gain = 1,
		type = 'lowpass',
	} = {}) {
		super();
		this._frequency = frequency;
		this._Q = Q;
		this._gain = gain;
		this._type = type;

		Context.onInit( () => {
			this.frequency = this._frequency;
			this.Q = this._Q;
			this.gain = this._gain;
			this.type = this._type;
		});
	}


	mount( src ) {
		if ( !this.isConnected( src ) ) {
			const node = Context.context.createBiquadFilter();
			node.frequency.value = this._frequency;
			node.Q.value = this._Q;
			node.gain.value = this._gain;
			node.type = this._type;

			return super.mount( src, node );
		}
		return src;
	}


	set frequency( val ) {
		this._frequency = val;
		this.nodes.forEach( ( n ) => {
			n.effectNode.frequency.value = val;
		});
	}


	get frequency() {
		return this._frequency;
	}


	set Q( val ) {
		this._Q = val;
		this.nodes.forEach( ( n ) => {
			n.effectNode.Q.value = val;
		});
	}


	get Q() {
		return this._Q;
	}


	set gain( val ) {
		this._gain = val;
		this.nodes.forEach( ( n ) => {
			n.effectNode.gain.value = val;
		});
	}


	get gain() {
		return this._gain;
	}


	set type( val ) {
		this._type = val;
		this.nodes.forEach( ( n ) => {
			n.effectNode.type = val;
		});
	}


	get type() {
		return this._type;
	}
}
