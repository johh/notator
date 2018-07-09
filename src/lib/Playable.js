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


	load( file ) {
		fetchAudio( file ).then( ( audio ) => {
			this.buffer = audio;
			this.prepare();
			this.loaded = true;
			this.dispatchEvent( 'load' );
		});
	}


	play( time ) {
		if ( this.preparedSource ) {
			const src = this.preparedSource;
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
