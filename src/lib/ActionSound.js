import Context from './Context';
import Playable from './Playable';


export default class ActionSound extends Playable {
	loaded = false

	constructor({
		file = '',
		smoothEnd = 0,
		effects = [],
		quantize = 0,
	} = {}) {
		super();

		this.smoothEnd = smoothEnd;
		this.effects = effects;
		this.quantize = quantize;

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


	play() {
		if ( this.quantize > 0 ) {
			const {
				currentTime,
				barDuration,
			} = this.timeline;

			const b = Math.ceil( currentTime / ( barDuration * this.quantize ) );
			super.play( b * barDuration * this.quantize );
		} else {
			super.play( 0 );
		}
	}


	setTimeline( timeline ) {
		this.timeline = timeline;
	}
}
