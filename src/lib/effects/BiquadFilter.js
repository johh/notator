import Context from '../Context';
import Effect from '../utils/Effect';
import ParamProxy from '../utils/ParamProxy';


export default class BiquadFilter extends Effect {
	constructor({
		frequency = 440,
		Q = 1,
		gain = 1,
		type = 'lowpass',
	} = {}) {
		super();


		this._frequency = new ParamProxy({
			prop: 'frequency',
			value: frequency,
			nodes: this.nodes,
		});
		this._Q = new ParamProxy({
			prop: 'Q',
			value: Q,
			nodes: this.nodes,
		});
		this._gain = new ParamProxy({
			prop: 'gain',
			value: gain,
			nodes: this.nodes,
		});
		this._type = type;
	}


	createNode( srcNode ) {
		const node = Context.context.createBiquadFilter();
		node.frequency.value = this._frequency.value;
		node.Q.value = this._Q.value;
		node.gain.value = this._gain.value;
		node.type = this._type;

		return super.createNode( srcNode, node );
	}


	set frequency( val ) {
		this._frequency.set( val );
	}


	get frequency() {
		return this._frequency.value;
	}


	set Q( val ) {
		this._Q.set( val );
	}


	get Q() {
		return this._Q.value;
	}


	set gain( val ) {
		this._gain.set( val );
	}


	get gain() {
		return this._gain.value;
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
