import Connectable from '../Connectable';


export default class Effect extends Connectable {
	nodes = []
	instanced = true


	createNode( src, effectNode ) {
		this.nodes.push({
			src,
			effectNode,
		});

		src.connect( effectNode );
		return effectNode;
	}


	removeNode( srcNode ) {
		const i = this.nodes.findIndex( n => n.src === srcNode );
		const { effectNode } = this.nodes[i];

		this.nodes.splice( i, 1 );
		srcNode.disconnect( effectNode );
		return effectNode;
	}
}
