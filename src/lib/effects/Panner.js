import Context from '../Context';
import Connectable from '../Connectable';
import ParamProxy from '../utils/ParamProxy';
import normalize from '../utils/normalize';


export default class Panner extends Connectable {
	nodes = []
	gainLeftNodes = []
	gainRightNodes = []


	constructor( pan = 0 ) {
		super();

		this._pan = new ParamProxy({
			prop: 'pan',
			value: pan,
			nodes: this.nodes,
		});

		const gain = Panner.gainFromPan( pan );

		this._gainLeft = new ParamProxy({
			prop: 'gain',
			value: {
				value: gain.left,
				smoothing: gain.smoothing,
			},
			nodes: this.gainLeftNodes,
		});

		this._gainRight = new ParamProxy({
			prop: 'gain',
			value: {
				value: gain.right,
				smoothing: gain.smoothing,
			},
			nodes: this.gainRightNodes,
		});

		Context.onInit( () => {
			this.native = !!Context.context.createStereoPanner;
		});
	}


	static gainFromPan( pan ) {
		const p = pan.value || pan;
		const smoothing = pan.smoothing || .001;

		return {
			left: normalize( p, 1, -1, true ),
			right: normalize( p, -1, 1, true ),
			smoothing,
		};
	}


	createNode( src ) {
		if ( this.native ) {
			const node = Context.context.createStereoPanner();

			node.pan.value = this._pan.value;
			src.connect( node );

			this.nodes.push({
				src,
				effectNode: node,
			});

			return node;
		}

		const splitter = Context.context.createChannelSplitter( 2 );
		const merger = Context.context.createChannelMerger( 2 );
		const gainLeft = Context.context.createGain();
		const gainRight = Context.context.createGain();

		gainLeft.gain.value = this._gainLeft.value;
		gainRight.gain.value = this._gainRight.value;

		splitter.connect( gainLeft, 0 );
		splitter.connect( gainRight, 1 );

		gainLeft.connect( merger, 0, 0 );
		gainRight.connect( merger, 0, 1 );

		this.gainLeftNodes.push({
			src,
			effectNode: gainLeft,
		});
		this.gainRightNodes.push({
			src,
			effectNode: gainRight,
		});
		this.nodes.push({
			src,
			merger,
			splitter,
		});

		src.connect( splitter );

		return merger;
	}


	removeNode( srcNode ) {
		const i = this.nodes.findIndex( n => n.src === srcNode );

		if ( this.native ) {
			const { effectNode } = this.nodes[i];

			this.nodes.splice( i, 1 );
			srcNode.disconnect( effectNode );

			return effectNode;
		}

		const { merger, splitter } = this.nodes[i];

		this.nodes.splice( i, 1 );
		this.gainLeftNodes.splice( i, 1 );
		this.gainRightNodes.splice( i, 1 );
		srcNode.disconnect( splitter );

		return merger;
	}


	set pan( val ) {
		this._pan.set( val );

		if ( !this.native ) {
			const gain = Panner.gainFromPan( val );
			this._gainLeft.set( gain.left );
			this._gainRight.set( gain.right );
		}
	}


	get pan() {
		return this._pan.value;
	}
}
