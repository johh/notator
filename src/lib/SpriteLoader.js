import Context from './Context';
import EventTarget from './EventTarget';
import fetchAudio from './utils/fetchAudio';


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
		this.parts = sprites;

		if ( file ) {
			fetchAudio( file )
				.then( audio => this.split( audio ) )
				.catch( e => this.reject( e ) );
		} else if ( buffer ) {
			Context.onInit( () => {
				Context.context.decodeAudioData( buffer, audio => this.split( audio ) );
			});
		} else {
			this.reject( 'No file or buffer specified.' );
		}

		return this.promise;
	}


	split( audio ) {
		const data = [];
		const sprites = {};

		for ( let channel = 0; channel < audio.numberOfChannels; channel += 1 ) {
			data.push( audio.getChannelData( channel ) );
		}

		Object.keys( this.parts ).forEach( ( key ) => {
			const { start, end } = this.parts[key];

			const buffer = Context.context.createBuffer(
				audio.numberOfChannels,
				( end - start ) * audio.sampleRate,
				audio.sampleRate,
			);

			data.forEach( ( d, i ) => {
				buffer.copyToChannel(
					d.slice( start * audio.sampleRate, end * audio.sampleRate ),
					i,
				);
			});

			sprites[key] = buffer;
		});

		this.resolve( sprites );
	}
}