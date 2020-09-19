import OperativeNode, { OperativeNodeProps } from './abstracts/OperativeNode';
import loadAudio from './utils/loadAudio';


export type Src = AudioBuffer | ArrayBuffer | string;

interface SourceProps extends OperativeNodeProps {
	src?: Src;
	gain?: number;
	autoDestroy?: boolean;
	onAutoDestroy?: () => void;
}

export default class Source extends OperativeNode {
	private src: Src;
	private loaded = false;
	private hasExternalBuffer = false;
	private gain: number;
	private sourceNode: AudioBufferSourceNode;
	public node: GainNode;

	constructor({
		src,
		gain = 1,
		onAutoDestroy,
		autoDestroy = true,
		...rest
	}: SourceProps = {}) {
		super( rest );

		this.src = src;
		this.gain = gain;
		this.context.ready( ( ctx ) => {
			this.node = ctx.createGain();
			this.node.gain.value = 0;

			this.sourceNode = ctx.createBufferSource();
			if ( autoDestroy ) {
				this.sourceNode.onended = (): void => {
					this.destroy();
					if ( onAutoDestroy ) onAutoDestroy();
				};
			}

			this.sourceNode.connect( this.node );
		});
	}


	public load(): Promise<void> {
		if ( !this.loaded ) {
			this.loaded = true;
			return loadAudio( this.src, this.context ).then( ( audio ) => {
				this.context.ready( () => {
					this.sourceNode.buffer = audio;
				});
			});
		}

		return Promise.resolve();
	}


	public setBuffer( audio: AudioBuffer ): void {
		this.sourceNode.buffer = audio;
		this.loaded = true;
		this.hasExternalBuffer = true;
	}


	public play( time = 0 ): void {
		this.sourceNode.start( time );
		this.node.gain.setTargetAtTime( this.gain, time, .02 );
	}


	public destroy(): void {
		this.sourceNode.stop();
		this.sourceNode.disconnect( this.node );
		if ( !this.hasExternalBuffer ) {
			this.loaded = false;
			this.sourceNode.buffer = null;
		}
		super.destroy();
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
