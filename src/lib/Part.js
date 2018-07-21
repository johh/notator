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
		load = true,
	} = {}) {
		super();

		this.duration = duration;
		this.effects = effects;
		this.loop = loop;
		this.shouldLoad = load;
		layers.forEach( layer => this.append( layer ) );

		if ( this.shouldLoad ) this.load();
	}


	append( layer ) {
		layer.setPart( this );
		this.layers.push( layer );
		this.dispatchEvent( 'append', layer );
	}


	remove( layer ) {
		this.layers.splice( this.layers.findIndex( l => l === layer ), 1 );
		this.dispatchEvent( 'remove', layer );
	}


	load() {
		const loaders = [];
		const progress = [];

		this.layers.forEach( ( l, i ) => {
			l.on( 'loading', ( p ) => {
				progress[i] = p;
				this.dispatchEvent( 'loading', progress.reduce( ( a, c ) => a + c ) / progress.length );
			});
			loaders.push( l.load() );
		});

		return Promise.all( loaders ).then( () => this.dispatchEvent( 'load' ) );
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
		this.layers.forEach( layer => layer.setTimeline( timeline ) );
	}


	get timeRemaining() {
		if ( this.timeline ) return Math.max( 0, this.endTime - this.timeline.currentTime );
		return undefined;
	}
}
