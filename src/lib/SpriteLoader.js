import Context from './Context';
import EventTarget from './EventTarget';
import AudioLoader from './utils/AudioLoader';


export default class SpriteLoader extends EventTarget {
	constructor({
		file,
		buffer,
		sprites,
	} = {}) {
		super();

		this.promise = new Promise( ( resolve, reject ) => {
			this.resolve = resolve;
			this.reject = reject;
		});
		this.file = file;
		this.buffer = buffer;
		this.parts = sprites;
	}


	load() {
		const loader = new AudioLoader( this.file || this.buffer );
		loader.on( 'loading', p => this.dispatchEvent( 'loading', p * .9 ) );
		loader.load()
			.then( audio => this.split( audio ) )
			.then( () => this.dispatchEvent( 'loading', 1 ) )
			.then( () => this.dispatchEvent( 'load' ) )
			.catch( e => this.reject( e ) );

		return this.promise;
	}


	split( audio ) {
		const sprites = {};

		Object.keys( this.parts ).forEach( ( key ) => {
			const { start, end } = this.parts[key];
			const buffer = Context.context.createBuffer(
				audio.numberOfChannels,
				( end - start ) * audio.sampleRate,
				audio.sampleRate,
			);

			for ( let channel = 0; channel < audio.numberOfChannels; channel += 1 ) {
				const destination = new Float32Array( ( end - start ) * audio.sampleRate );

				audio.copyFromChannel( destination, channel, start * audio.sampleRate );
				buffer.copyToChannel(
					destination,
					channel,
				);
			}

			sprites[key] = buffer;
		});

		this.resolve( sprites );
	}
}
