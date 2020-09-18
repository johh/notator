import OperativeNode, { OperativeNodeProps } from './abstracts/OperativeNode';
import loadAudio from './utils/loadAudio';


export type Src = AudioBuffer | ArrayBuffer | string;

interface SourceProps extends OperativeNodeProps {
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
		...rest
		super( rest );

		this.src = src;
		this.context.ready( ( ctx ) => {
			this.node = ctx.createBufferSource();
		});
	}


	public load(): Promise<void> {
		if ( !this.loaded ) {
			this.loaded = true;
			return loadAudio( this.src ).then( ( audio ) => {
				this.context.ready( () => {
					this.sourceNode.buffer = audio;
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
