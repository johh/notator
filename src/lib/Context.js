class Context {
	context = null
	initialized = false
	initFunctions = []

	constructor() {
		if ( window.AudioContext || window.webkitAudioContext ) {
			this.isSafari = !window.AudioContext && !!window.webkitAudioContext;

			const context = new ( window.AudioContext || window.webkitAudioContext )();
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


	start() {
		this.onInit( () => {
			this.context.resume();
		});
	}


	_initChildren() {
		this.initialized = true;

		this.initFunctions.forEach( func => func() );
		this.initFunctions = [];
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
