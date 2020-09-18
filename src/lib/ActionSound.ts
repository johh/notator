import type Timeline from './Timeline';
import Playable, { PlayableProps } from './abstracts/Playable';


interface ActionSoundProps extends PlayableProps {
	quantize?: number;
}

export default class ActionSound extends Playable {
	private readonly quantize: number;

	constructor({
		quantize = 0,
		...rest
	}: ActionSoundProps ) {
		super( rest );
		this.quantize = quantize;
	}


	public play(): void {
		if ( this.buffer ) {
			const source = this.createSource();

			if ( this.quantize > 0 ) {
				const time = this.timeline.context.getTime();
				const b = Math.ceil( time / ( this.timeline.barDuration * this.quantize ) );

				source.play( b * this.timeline.barDuration * this.quantize );
			} else {
				source.play( 0 );
			}
		}
	}


	public bindTimeline( timeline: Timeline ): void {
		super.bindTimeline( timeline );
		this.bus.connect( timeline.bus );
	}
}
