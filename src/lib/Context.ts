declare const webkitAudioContext: typeof AudioContext;


type F = ( ctx: AudioContext ) => void;


export default class Context {
	private readyQueue: F[] = [];
	private started: Promise<AudioContext>;
	public isSafari = typeof AudioContext === 'undefined' && !!webkitAudioContext;
	public context: AudioContext;
	public initialized = false;


	public start(): Promise<AudioContext> {
		if ( !this.started ) {
			this.started = new Promise( ( resolve, reject ) => {
				try {
					this.context = new ( this.isSafari ? webkitAudioContext : AudioContext )();
					this.context.onstatechange = (): void => {
						if ( this.context.state === 'running' ) {
							this.readyQueue.forEach( f => f( this.context ) );
							this.readyQueue = [];
							resolve( this.context );
							this.initialized = true;
						}
					};

					this.context.resume();
				} catch {
					reject();
				}
			});
		}

		return this.started;
	}


	public ready( func: F ): void {
		if ( this.context ) {
			func( this.context );
		} else {
			this.readyQueue.push( func );
		}
	}


	public getTime(): number {
		if ( this.context ) {
			return this.context.currentTime;
		}

		return 0;
	}
}
