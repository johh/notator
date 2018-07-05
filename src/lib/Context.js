class Context {
	context = null
	initialized = false
	initFunctions = []

	init() {
		if ( window.AudioContext ) {
			const context = new AudioContext();
			context.onstatechange = () => {
				if ( context.state === 'running' ) {
					this.context = context;
					if ( !this.initialized ) this._initChildren();
				}
			};
		} else {
			console.error( 'This browser does not support WebAudio.' );
		}
	}


	_initChildren() {
		this.initialized = true;

		this.initFunctions.forEach( func => func() );
	}


	onInit( func ) {
		if ( this.initialized ) {
			func();
		} else {
			this.initFunctions.push( func );
		}
	}


	close() {
		if ( this.context ) this.context.close();
	}
}

export default new Context();
