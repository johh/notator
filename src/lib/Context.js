class Context {
	context = null
	initialized = false
	initFunctions = []
	webAudioSupport = false

	constructor() {
		if ( window.AudioContext || window.webkitAudioContext ) {
			this.isSafari = !window.AudioContext && !!window.webkitAudioContext;
			this.webAudioSupport = true;
		} else {
			console.error( 'This browser does not support WebAudio.' );
		}
	}


	start() {
		if ( !this.promise ) {
			this.promise = new Promise( ( resolve, reject ) => {
				if ( this.webAudioSupport ) {
					const context = new ( window.AudioContext || window.webkitAudioContext )();
					context.resume();
					context.onstatechange = () => {
						if ( context.state === 'running' ) {
							this.context = context;
							if ( !this.initialized ) this._initChildren();
							resolve();
						}
					};
				} else {
					reject();
				}
			});
		}

		return this.promise;
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
