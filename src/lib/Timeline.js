import Context from './Context';


export default class Timeline {
	parts = []
	running = false
	startTime = 0

	constructor({
		bpm = 60,
		bpb = 4,
		tickrate = 8,
		effects = [],
	} = {}) {
		this.barDuration = 60 / ( bpm / bpb );
		this.tickrate = tickrate;
		this.effects = effects;

		Context.onInit( () => {
			console.log( bpm, this.barDuration, this.startTime );
			this.tick();
		});
	}


	play( part ) {
		if ( !this.running ) {
			this.startTime = Context.context.currentTime;
			this.running = true;
		}
		// TODO: check for duplicate
		// TODO: check if already connected
		part.setTimeline( this );
		this.parts.push( part );

		part.play( 0 );
	}


	tick() {
		this.parts.forEach( part => part.layers.forEach( layer => layer.tick() ) );

		setTimeout( () => this.tick(), 1000 / this.tickrate );
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


	get currentBarProgress() {
		return ( this.currentTime / this.barDuration ) % 1;
	}
}
