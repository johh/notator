export default class Part {
	layers = []
	timeline = null

	constructor({
		duration = 4,
		layers = [],
		effects = [],
		loop = false,
	} = {}) {
		this.duration = duration;
		this.effects = effects;
		this.loop = loop;
		layers.forEach( layer => this.append( layer ) );
	}


	append( layer ) {
		// TODO: check for duplicate
		// TODO: check if already connected
		layer.part = this;
		this.layers.push( layer );
	}


	remove( layer ) {
		this.layers.splice( this.layers.findIndex( l => l === layer ), 1 );
	}


	play( time = 0 ) {
		this.endTime = time + ( this.duration * this.timeline.barDuration );

		this.layers.forEach( layer => layer.play( time, this.endTime ) );
	}


	destroy() {
		this.timeline.removePart( this );
	}


	tick() {
		if ( this.timeline.currentTime >= this.endTime ) this.destroy();
	}


	setTimeline( timeline ) {
		this.timeline = timeline;
		this.layers.forEach( ( layer ) => {
			layer.timeline = timeline;
		});
	}
}
