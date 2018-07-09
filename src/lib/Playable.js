import Source from './Source';
import fetchAudio from './utils/fetchAudio';


export default class Playable {
	sources = []
	preparedSource = null


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
		});
	}


	play( time ) {
		if ( this.preparedSource ) {
			const src = this.preparedSource;
			this.preparedSource = null;

			src.play( time );
			this.prepare();
		}
	}
}
