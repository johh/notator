export default class Effect {
	nodes = []


	isConnected( src ) {
		return !!this.nodes.find( n => n.src === src );
	}


	mount( src, effectNode ) {
		if ( !this.isConnected( src ) ) {
			src.connect( effectNode );

			this.nodes.push({
				src,
				effectNode,
			});

			return effectNode;
		}

		return src;
	}


	unmount( src ) {
		const i = this.nodes.findIndex( n => n.src === src );
		const { effectNode } = this.nodes[i];

		this.nodes.splice( i, 1 );
		return effectNode;
	}
}
