import Context from '../Context';
import Connectable from '../Connectable';
import ParamProxy from '../utils/ParamProxy';


export default class DynamicsCompressor extends Connectable {
	instanced = false
	nodes = []


	constructor({
		threshold = -24,
		knee = 30,
		ratio = 12,
		attack = .003,
		release = .25,
	} = {}) {
		super();
		this._threshold = new ParamProxy({
			prop: 'threshold',
			value: threshold,
			nodes: this.nodes,
		});
		this._knee = new ParamProxy({
			prop: 'knee',
			value: knee,
			nodes: this.nodes,
		});
		this._ratio = new ParamProxy({
			prop: 'ratio',
			value: ratio,
			nodes: this.nodes,
		});
		this._attack = new ParamProxy({
			prop: 'attack',
			value: attack,
			nodes: this.nodes,
		});
		this._release = new ParamProxy({
			prop: 'release',
			value: release,
			nodes: this.nodes,
		});


		Context.onInit( () => {
			const node = Context.context.createDynamicsCompressor();
			node.threshold.value = this._threshold.value;
			node.knee.value = this._knee.value;
			node.ratio.value = this._ratio.value;
			node.attack.value = this._attack.value;
			node.release.value = this._release.value;

			this.effectNode = node;
			this.nodes.push({ effectNode: node });
		});
	}


	createNode( srcNode ) {
		srcNode.connect( this.effectNode );
		return this.effectNode;
	}


	removeNode( srcNode ) {
		srcNode.disconnect( this.effectNode );
		return this.effectNode;
	}


	set threshold( val ) {
		this._threshold.set( val );
	}


	get threshold() {
		return this._threshold.value;
	}


	set knee( val ) {
		this._knee.set( val );
	}


	get knee() {
		return this._knee.value;
	}


	set ratio( val ) {
		this._ratio.set( val );
	}


	get ratio() {
		return this._ratio.value;
	}


	set attack( val ) {
		this._attack.set( val );
	}


	get attack() {
		return this._attack.value;
	}


	set release( val ) {
		this._release.set( val );
	}


	get release() {
		return this._release.value;
	}
}
