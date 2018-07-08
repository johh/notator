export default class Part {
	layers = []
	timeline = null

	constructor({
		duration = 4,
		layers = [],
		effects = [],
	} = {}) {
		this.duration = duration;
		this.effects = effects;
		layers.forEach( layer => this.append( layer ) );

		console.log( duration );
	}


	append( layer ) {
		// TODO: check for duplicate
		// TODO: check if already connected
		layer.part = this;
		this.layers.push( layer );
		// layer.timeline = this.timeline;
	}


	remove( layer ) {
		this.layers.splice( this.layers.findIndex( l => l === layer ), 1 );
	}


	play( time = 0 ) {
		const endTime = time + ( this.duration * this.timeline.barDuration );

		this.layers.forEach( layer => layer.play( time, endTime ) );
	}


	setTimeline( timeline ) {
		this.timeline = timeline;
		this.layers.forEach( ( layer ) => {
			layer.timeline = timeline;
		});
	}
}
