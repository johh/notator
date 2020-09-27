import type Timeline from './Timeline';
import type Track from './Track';
import Container, { ContainerProps } from './abstracts/Container';


interface PartProps extends ContainerProps {
	tracks: Track[];
	duration: number;
	loop?: boolean;
}


export default class Part extends Container {
	private readonly tracks: Track[];
	public readonly duration: number;
	public readonly loop: boolean;

	constructor({
		tracks,
		effects,
		duration,
		loop = true,
	}: PartProps ) {
		super({ effects });

		this.tracks = tracks;
		this.duration = duration;
		this.loop = loop;

		tracks.forEach( t => t.bindPart( this ) );
	}


	public bindTimeline( timeline: Timeline ): void {
		super.bindTimeline( timeline );
		this.bus.connect( timeline.bus );
		this.tracks.forEach( t => t.bindTimeline( timeline ) );
	}


	public play( time: number ): void {
		this.tracks.forEach( t => t.play( time ) );
	}


	public load(): Promise<void[]> {
		return Promise.all( this.tracks.map( t => t.load() ) );
	}


	public destroy(): void {
		this.timeline.bus.disconnect( this.bus );
		this.tracks.forEach( t => t.destroy() );
		super.destroy();
	}
}
