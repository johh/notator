import Context from '../Context';
import Effect from './Effect';


export default class DynamicsCompressor extends Effect {
	constructor({
		threshold = -24,
		knee = 30,
		ratio = 12,
		attack = .003,
		release = .25,
	} = {}) {
		super();
		this._threshold = threshold;
		this._knee = knee;
		this._ratio = ratio;
		this._attack = attack;
		this._release = release;

		Context.onInit( () => {
			this.threshold = this._threshold;
			this.knee = this._knee;
			this.ratio = this._ratio;
			this.attack = this._attack;
			this.release = this._release;
		});
	}


	mount( src ) {
		if ( !this.isConnected( src ) ) {
			const node = Context.context.createDynamicsCompressor();
			node.threshold.value = this._threshold;
			node.knee.value = this._knee;
			node.ratio.value = this._ratio;
			node.attack.value = this._attack;
			node.release.value = this._release;

			return super.mount( src, node );
		}
		return src;
	}


	set threshold( val ) {
		this._threshold = val;
		this.nodes.forEach( ( n ) => {
			n.effectNode.threshold.value = val;
		});
	}


	get threshold() {
		return this._threshold;
	}


	set knee( val ) {
		this._knee = val;
		this.nodes.forEach( ( n ) => {
			n.effectNode.knee.value = val;
		});
	}


	get knee() {
		return this._knee;
	}


	set ratio( val ) {
		this._ratio = val;
		this.nodes.forEach( ( n ) => {
			n.effectNode.ratio.value = val;
		});
	}


	get ratio() {
		return this._ratio;
	}


	set attack( val ) {
		this._attack = val;
		this.nodes.forEach( ( n ) => {
			n.effectNode.attack.value = val;
		});
	}


	get attack() {
		return this._attack;
	}


	set release( val ) {
		this._release = val;
		this.nodes.forEach( ( n ) => {
			n.effectNode.release.value = val;
		});
	}


	get release() {
		return this._release;
	}
}
