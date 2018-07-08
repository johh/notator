import Context from './Context';
import Source from './Source';


export default class Layer {
	loaded = false
	sources = []
	preparedSource = null
	loopScheduled = false
	lastPlayStart = 0


	constructor({
		file = '',
		duration = 1,
		padding = 0,
		offset = 0,
		smoothEnd = .15,
		loop = false,
		effects = [],
	} = {}) {
		this.loop = loop;
		this.duration = duration;
		this.padding = padding;
		this.offset = offset;
		this.smoothEnd = smoothEnd;
		this.effects = effects;

		fetch( file )
			.then( response => response.arrayBuffer() )
			.then( buffer => Context.context.decodeAudioData( buffer ) )
			.then( ( audio ) => {
				this.buffer = audio;
				this.prepare();
				this.loaded = true;
			})
			.catch( e => console.error( `Failed to load "${file}"`, e ) );
	}


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


	play( _time = 0, endTime = this.loopEndTime ) {
		const { barDuration } = this.timeline;
		let time = _time + ( barDuration * this.padding );


		this.loopEndTime = endTime;
		this.lastPlayStart = time;

		time += this.offset * barDuration;

		console.log( 'start', time / 4, endTime / 4 );

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
	}
}
