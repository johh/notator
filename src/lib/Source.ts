import OperativeNode from './OperativeNode';
import defaultContext from './defaultContext';
import loadAudio from './utils/loadAudio';


export type Src = AudioBuffer | ArrayBuffer | string;

interface SourceProps {
	src: Src;
}

export default class Source extends OperativeNode {
	public node: AudioBufferSourceNode;
	private src: Src;
	private loaded = false;

	constructor({
		src,
	}: SourceProps ) {
		super();

		this.src = src;
		defaultContext.ready( ( ctx ) => {
			this.node = ctx.createBufferSource();
		});
	}


	public load(): Promise<void> {
		if ( !this.loaded ) {
			this.loaded = true;
			return loadAudio( this.src ).then( ( audio ) => {
				defaultContext.ready( () => {
					this.node.buffer = audio;
				});
			});
		}

		return new Promise( ( r ) => r() );
	}


	// eslint-disable-next-line class-methods-use-this
	public addParent(): void {
		throw new Error( 'A Source cannot have parents.' );
	}


	// eslint-disable-next-line class-methods-use-this
	public removeParent(): void {
		throw new Error( 'A Source cannot have parents.' );
	}
}
