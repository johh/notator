import Playable from './Playable';


export default class Layer extends Playable {
	loaded = false
	loopScheduled = false
	lastPlayStart = 0


	constructor({
		src = '',
		duration = 1,
		padding = 0,
		offset = 0,
		smoothEnd = .15,
		loop = false,
		load = false,
		effects = [],
	} = {}) {
		super();

		this.src = src;
		this.loop = loop;
		this.duration = duration;
		this.padding = padding;
		this.offset = offset;
		this.smoothEnd = smoothEnd;
		this.effects = effects;

		if ( load ) this.load();
	}


	play( _time = 0, endTime = this.loopEndTime ) {
		const { barDuration } = this.timeline;
		let time = _time + ( barDuration * this.padding );


		this.loopEndTime = endTime;
		this.lastPlayStart = time;

		time += this.offset * barDuration;

		super.play( time );

		if ( this.loop ) {
			if ( this.lastPlayStart + ( 2 * this.duration * barDuration ) <= endTime ) {
				this.shouldRescheduleOn = Math.floor( time / barDuration ) + this.duration;
			} else {
				this.shouldRescheduleOn = false;
			}
		}
	}


	tick() {
		if ( this.loop ) {
			const { barDuration, currentBarExact, lookahead } = this.timeline;

			if ( this.shouldRescheduleOn &&
				this.shouldRescheduleOn - currentBarExact <= lookahead ) {
				this.play( ( this.shouldRescheduleOn ) * barDuration );
			}
		}
	}


	setTimeline( timeline ) {
		this.timeline = timeline;
	}


	setPart( part ) {
		this.part = part;
	}
}
