import type Part from './Part';
import Playable, { PlayableProps } from './abstracts/Playable';


interface TrackProps extends PlayableProps{
	duration: number;
	loop?: boolean;
}


export default class Track extends Playable {
	public readonly duration: number;
	private readonly loop: boolean;
	private part: Part;

	constructor({
		duration,
		loop = false,
		...rest
	}: TrackProps ) {
		super( rest );

		this.duration = duration;
		this.loop = loop;
	}


	public play( start = 0 ): void {
		if ( this.buffer ) {
			const time = this.timeline.context.getTime();
			const startTimes = this.loop
				? Array( Math.round( this.part.duration / this.duration ) )
					.fill( 0 )
					.map( ( _, i ) => start + ( i * this.duration * this.timeline.barDuration ) )
				: [start];

			startTimes.forEach( ( startTime ) => {
				if ( startTime < time ) {
					// eslint-disable-next-line no-console
					console.warn( 'Cue has already passed. Skipping...' );
				} else {
					const source = this.createSource();
					source.play( startTime );
				}
			});
		}
	}


	public bindPart( part: Part ): void {
		this.part = part;
		this.bus.connect( part.bus );
	}
}
