import Context from './Context';
import Playable from './Playable';


export default class Layer extends Playable {
	loaded = false
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
		super();

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


	play( _time = 0, endTime = this.loopEndTime ) {
		const { barDuration } = this.timeline;
		let time = _time + ( barDuration * this.padding );


		this.loopEndTime = endTime;
		this.lastPlayStart = time;

		time += this.offset * barDuration;

		console.log( 'start', time / 4, endTime / 4 );

		super.play( time );

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
