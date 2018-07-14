import Context from '../Context';


export default class ParamProxy {
	constructor({
		value = 0,
		smoothing = .001,
		nodes = [],
		prop = 'gain',
	} = {}) {
		if ( typeof value === 'object' ) {
			const opts = Object.assign({
				value: 0,
				smoothing: .001,
			}, value );
			this.value = opts.value;
			this.smoothing = opts.smoothing;
		} else {
			this.value = value;
			this.smoothing = smoothing;
		}

		this.nodes = nodes;
		this.prop = prop;

		Context.onInit( () => this.set( this.value, true ) );
	}


	set( val, force = false ) {
		if ( val !== this.value || force ) {
			this.value = val;
			this.nodes.forEach( ( n ) => {
				n.effectNode[this.prop].cancelScheduledValues( 0 );
				n.effectNode[this.prop].setTargetAtTime( val, 0, this.smoothing );
			});
		}
	}
}
