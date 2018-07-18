import Playable from './Playable';


export default class ActionSound extends Playable {
	loaded = false

	constructor({
		file = '',
		smoothEnd = 0,
		effects = [],
		quantize = 0,
		pitch = 1,
	} = {}) {
		super();

		this.smoothEnd = smoothEnd;
		this.effects = effects;
		this.quantize = quantize;
		this.pitch = pitch;

		this.load( file );
	}


	play() {
		if ( this.quantize > 0 ) {
			const {
				currentTime,
				barDuration,
			} = this.timeline;

			const b = Math.ceil( currentTime / ( barDuration * this.quantize ) );
			super.play( b * barDuration * this.quantize, this.pitch );
		} else {
			super.play( 0, this.pitch );
		}
	}


	setTimeline( timeline ) {
		this.timeline = timeline;
	}
}
