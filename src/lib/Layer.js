import Context from './Context';
import Source from './Source';


export default class Layer {
	loaded = false
	sources = []
	preparedSource = null
	loopScheduled = false

	constructor({
		file = '',
		duration = 1,
		smoothEnd = .15,
		loop = false,
		lastPlayStart = 0,
	} = {}) {
		this.loop = loop;
		this.duration = duration;
		this.smoothEnd = smoothEnd;

		fetch( file )
			.then( response => response.arrayBuffer() )
			.then( buffer => Context.context.decodeAudioData( buffer ) )
			.then( ( audio ) => {
				this.buffer = audio;
				// this.sourceNode = Context.context.createBufferSource();
				// this.sourceNode.buffer = audio;
				// this.sourceNode.loop = true;

				// this.gainNode = Context.context.createGain();
				// this.sourceNode.connect( this.gainNode );

				this.prepare();

				// this.play();
				this.loaded = true;
			})
			.catch( e => console.error( `Failed to load "${file}"`, e ) );

		// window.requestAnimationFrame( () => this.tick() ); // TEMP!
	}


	prepare() {
		if ( !this.preparedSource ) {
			const src = new Source({
				buffer: this.buffer,
				parent: this,
				fade: this.smoothEnd,
			});
			src.node.connect( Context.context.destination );
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


	play( time = 0, endTime = this.loopEndTime ) {
		console.log( 'start', time / 4, endTime / 4 );
		const { barDuration } = this.timeline;

		this.loopEndTime = endTime;
		this.lastPlayStart = time;

		if ( this.preparedSource ) {
			const src = this.preparedSource;
			this.preparedSource = null;

			src.play( time );
			this.prepare();
		}

		if ( this.loop ) {
			if ( this.lastPlayStart + ( 2 * this.duration * barDuration ) <= endTime ) {
				this.shouldRescheduleOn = Math.floor( time / barDuration ) + ( this.duration - 1 );
			} else {
				this.shouldRescheduleOn = false;
			}
		}
	}


	tick() {
		if ( this.loop ) {
			const { barDuration, currentBar } = this.timeline;

			if ( this.shouldRescheduleOn === currentBar ) {
				this.play( ( currentBar + 1 ) * barDuration );
			}
		}
		// window.requestAnimationFrame( () => this.tick() ); // TEMP!
	}
}
