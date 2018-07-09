export default class EventTarget {
	listeners = {}


	on( name, handler ) {
		if ( typeof name === 'string' && typeof handler === 'function' ) {
			if ( !this.listeners[name]) this.listeners[name] = [];

			this.listeners[name].push( handler );
		} else if ( typeof name === 'string' ) {
			throw new Error( 'No handler function supplied.' );
		} else {
			throw new Error( 'No valid event name supplied.' );
		}
	}


	off( name, handler ) {
		if ( typeof name === 'string' && typeof handler === 'function' ) {
			const handlers = this.listeners[name];
			if ( handlers ) {
				handlers.splice( handlers.findIndex( h => h === handler ), 1 );
			}
		} else if ( typeof name === 'string' ) {
			throw new Error( 'No handler function supplied.' );
		} else {
			throw new Error( 'No valid event name supplied.' );
		}
	}


	addEventListener( name, func ) {
		this.on( name, func );
	}


	removeEventListener( name, func ) {
		this.off( name, func );
	}


	dispatchEvent( name, payload ) {
		if ( this.listeners[name]) {
			this.listeners[name].forEach( l => l( payload ) );
		}
	}
}
