import Context from './Context';
import Destination from './Destination';
import Layer from './Layer';
import Connectable from './Connectable';


export default class Source extends Connectable {
	instanced = false


	constructor({ buffer, parent, fade = 0 }) {
		super();

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
		const {
			parent: { timeline },
			src,
			fade,
			node,
		} = this;


		this.mount();
		src.start( timeline.toAbs( time ) );
		if ( fade > 0 ) {
			node.gain.setTargetAtTime(
				0,
				timeline.toAbs( ( time + src.buffer.duration ) - ( fade * 1.5 ) ),
				fade,
			);
		}
	}


	walkConnectables( mount ) {
		let lastConnectable = {
			node: this.node,
			connectable: this,
		};

		const connectables = [].concat(
			this.parent.effects,
			( this.parent instanceof Layer ) ? this.parent.part.effects : [],
			this.parent.timeline.effects,
			Destination,
		);


		for ( let i = 0; i < connectables.length; i += 1 ) {
			const c = connectables[i];

			if ( mount ) {
				lastConnectable = c.mount( lastConnectable );
			} else {
				lastConnectable = c.unmount( lastConnectable );
			}

			if ( lastConnectable === null ) break;
		}
	}


	mount() {
		this.walkConnectables( true );
	}


	unmount() {
		this.walkConnectables( false );
	}


	destroy() {
		this.unmount();
		this.src.stop();
	}
}
