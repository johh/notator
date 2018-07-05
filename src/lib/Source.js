import Context from './Context';


export default class Source {
	constructor({ buffer, parent, fade = 0 }) {
		this.buffer = buffer;
		this.fade = fade;
		this.parent = parent;
		this.src = Context.context.createBufferSource();
		this.src.buffer = buffer;
		this.src.onended = () => parent.destroySource( this );

		if ( fade > 0 ) {
			this.node = Context.context.createGain();
			// this.node.gain.value = 0;
			this.src.connect( this.node );
		} else {
			this.node = this.src;
		}
	}

	play( time = 0 ) {
		this.src.start( time + this.parent.timeline.startTime );
		if ( this.fade > 0 ) {
			// this.node.gain.setTargetAtTime( 1, time + this.fade, this.fade );
			this.node.gain.setTargetAtTime( 0, ( time + this.src.buffer.duration ) - ( this.fade * 1.5 ), this.fade );
		}
	}

	destroy() {
		this.src.stop();
	}
}
