import ConnectionReference from './utils/ConnectionReference';


export default class Connectable {
	instanced = true
	connected = false
	connections = []


	isConnected( src ) {
		return !!this.connections.find( c => c.src.node === src.node );
	}


	setConnected() {
		if ( !this.instanced ) this.connected = true;
	}


	shouldConnect() {
		return ( this.instanced || ( !this.instanced && !this.connected ) );
	}


	shouldDisconnect() {
		return !this.instanced;
	}


	mount( src ) {
		if ( !this.isConnected( src ) && src.connectable.shouldConnect() ) {
			const ref = new ConnectionReference({
				src,
				target: {
					connectable: this,
					node: this.createNode( src.node ),
				},
			});

			src.connectable.setConnected();
			this.connections.push( ref );

			return ref.target;
		}

		return null;
	}


	unmount( src ) {
		if ( src.connectable.shouldDisconnect() ) {
			const i = this.connections.findIndex( c => c.src.node === src.node );
			if ( i >= 0 ) {
				const { target } = this.connections[i];

				this.connections.splice( i, 1 );
				this.removeNode( src.node );
				return target;
			}
		}

		return null;
	}


	createNode( srcNode ) {
		console.error( 'Connectables require a createNode method.', this, srcNode );
	}


	removeNode( srcNode ) {
		console.error( 'Connectables require a removeNode method.', this, srcNode );
	}
}
