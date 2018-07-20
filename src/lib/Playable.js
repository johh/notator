import Source from './Source';
import EventTarget from './EventTarget';
import fetchAudio from './utils/fetchAudio';


export default class Playable extends EventTarget {
	sources = []
	preparedSource = null
	firstPlay = true


	prepare() {
		if ( !this.preparedSource ) {
			const src = new Source({
				buffer: this.buffer,
				parent: this,
				fade: this.smoothEnd,
			});
			this.sources.push( src );
			this.preparedSource = src;
		} else {
			console.warn( 'Already prepared!' );
		}
	}


	destroySource( src ) {
		this.sources.splice( this.sources.findIndex( s => s === src ), 1 );
		src.destroy();
	}


	load( file = this.file ) {
		if ( !this.loadPromise ) {
			this.loadPromise = fetchAudio( file ).then( ( audio ) => {
				this.buffer = audio;
				this.prepare();
				this.loaded = true;
				this.dispatchEvent( 'load' );
			});
		}

		return this.loadPromise;
	}


	play( time, pitch = 1 ) {
		if ( this.preparedSource ) {
			const src = this.preparedSource;
			src.pitch = pitch;

			this.preparedSource = null;

			src.play( time );
			this.prepare();
		}
		this.firstPlay = false;
	}


	destroy() {
		this.firstPlay = true;
	}
}
