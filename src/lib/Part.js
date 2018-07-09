import EventTarget from './EventTarget';


export default class Part extends EventTarget {
	layers = []
	timeline = null
	firstPlay = true

	constructor({
		duration = 4,
		layers = [],
		effects = [],
		loop = false,
	} = {}) {
		super();

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
		this.dispatchEvent( 'append', layer );
	}


	remove( layer ) {
		this.layers.splice( this.layers.findIndex( l => l === layer ), 1 );
		this.dispatchEvent( 'remove', layer );
	}


	play( time = 0 ) {
		this.endTime = time + ( this.duration * this.timeline.barDuration );

		this.layers.forEach( layer => layer.play( time, this.endTime ) );

		this.dispatchEvent( this.firstPlay ? 'play' : 'loop', time - this.timeline.currentTime );

		this.firstPlay = false;
	}


	destroy() {
		this.timeline.removePart( this );
		this.layers.forEach( layer => layer.destroy() );
		this.firstPlay = true;
		this.dispatchEvent( 'end' );
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
