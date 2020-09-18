import type Context from '../Context';
import type Timeline from '../Timeline';
import Source, { Src } from '../Source';
import Container, { ContainerProps } from './Container';
import loadAudio from '../utils/loadAudio';
import defaultContext from '../defaults/defaultContext';


export interface PlayableProps extends ContainerProps {
	src: Src;
	gain?: number;
	load?: boolean;
}

export default abstract class Playable extends Container {
	private readonly autoLoad: boolean;
	private readonly gain: number;
	protected sources: Source[] = [];
	protected buffer: AudioBuffer;
	protected context: Context;
	public readonly src: Src;


	constructor({
		src,
		gain,
		load = true,
		...rest
	}: PlayableProps ) {
		super( rest );

		this.src = src;
		this.gain = gain;
		this.autoLoad = load;
	}


	public load(): Promise<void> {
		if ( !this.buffer ) {
			return loadAudio( this.src, this.context || defaultContext ).then( buffer => {
				this.buffer = buffer;
			});
		}

		return Promise.resolve();
	}


	protected createSource(): Source {
		const source = new Source({
			context: this.context,
			gain: this.gain,
			onAutoDestroy: (): void => {
				source.disconnect( this.bus );
				this.sources.splice( this.sources.findIndex( s => s === source ), 1 );
			},
		});
		source.setBuffer( this.buffer );
		source.connect( this.bus );
		this.sources.push( source );

		return source;
	}


	public bindTimeline( timeline: Timeline ): void {
		super.bindTimeline( timeline );
		this.context = timeline.context;

		if ( this.autoLoad ) this.load();
	}


	public destroy(): void {
		this.sources.forEach( s => s.destroy() );
		super.destroy();
	}
}
