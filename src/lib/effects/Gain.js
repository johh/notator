import Context from '../Context';
import Effect from '../utils/Effect';
import ParamProxy from '../utils/ParamProxy';


export default class Gain extends Effect {
	constructor( gain = 1 ) {
		super();

		this._gain = new ParamProxy({
			prop: 'gain',
			value: gain,
			nodes: this.nodes,
		});
	}


	createNode( srcNode ) {
		const node = Context.context.createGain();
		node.gain.value = this._gain.value;

		return super.createNode( srcNode, node );
	}


	set gain( val ) {
		this._gain.set( val );
	}


	get gain() {
		return this._gain.value;
	}
}
