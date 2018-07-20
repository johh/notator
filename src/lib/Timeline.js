import Context from './Context';
import Part from './Part';
import ActionSound from './ActionSound';


export default class Timeline {
	queue = []
	parts = []
	running = false
	startTime = 0
	currentPart = null

	constructor({
		bpm = 60,
		bpb = 4,
		tickrate = 8,
		lookahead = .5,
		effects = [],
	} = {}) {
		this.barDuration = 60 / ( bpm / bpb );
		this.lookahead = lookahead;
		this.tickrate = tickrate;
		this.effects = effects;

		Context.onInit( () => {
			this.tick();
		});
	}


	play( part ) {
		if ( part instanceof Part ) {
			if ( !this.running ) {
				Context.onInit( () => {
					this.startTime = Context.context.currentTime + ( 1 / this.tickrate );
					this.running = true;
				});
			}

			part.setTimeline( this );
			this.parts.push( part );
			this.queue.push( part );
		} else if ( part instanceof ActionSound ) {
			part.setTimeline( this );
			part.play();
		}
	}


	removePart( part ) {
		this.parts.splice( this.parts.findIndex( p => p === part ), 1 );
	}


	scheduleNextPart() {
		if ( !this.currentPart ) {
			const time = Math.ceil( this.currentBarExact ) * this.barDuration;

			this.currentPart = {
				part: this.queue.shift(),
				startTime: time,
			};
			this.currentPart.part.play( time );
		} else if ( this.queue.length > 0 ) {
			const time = this.currentPart.startTime +
				( Math.ceil( this.currentPart.part.duration ) * this.barDuration );

			this.currentPart.part.destroy();

			this.currentPart = {
				part: this.queue.shift(),
				startTime: time,
			};
			this.currentPart.part.play( time );
		} else if ( this.currentPart.part.loop ) {
			const time = this.currentPart.startTime +
				( Math.ceil( this.currentPart.part.duration ) * this.barDuration );

			this.currentPart = {
				part: this.currentPart.part,
				startTime: time,
			};
			this.currentPart.part.play( time );
		} else {
			this.currentPart = null;
		}
	}


	tick() {
		this.parts.forEach( part => part.layers.forEach( layer => layer.tick() ) );

		if ( !this.currentPart && this.queue.length > 0 && this.running ) {
			this.scheduleNextPart();
		} else if ( this.currentPart &&
			( this.currentPart.part.duration * this.barDuration ) -
			( this.currentTime - this.currentPart.startTime )
			<= this.lookahead * this.barDuration ) {
			this.scheduleNextPart();
		}

		setTimeout( () => this.tick(), 1000 / this.tickrate );
	}


	toAbs( time ) {
		return time + this.startTime;
	}


	get currentTime() {
		if ( Context.context && this.running ) {
			return Context.context.currentTime - this.startTime;
		}
		return 0;
	}


	get currentBar() {
		return Math.floor( this.currentTime / this.barDuration );
	}


	get currentBarExact() {
		return this.currentTime / this.barDuration;
	}


	get currentBarProgress() {
		return ( this.currentTime / this.barDuration ) % 1;
	}
}
