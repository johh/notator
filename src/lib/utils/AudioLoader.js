import Context from '../Context';
import EventTarget from '../EventTarget';


export default class AudioLoader extends EventTarget {
	constructor( input ) {
		super();

		this.input = input;
	}


	load() {
		return new Promise( ( resolve, reject ) => {
			if ( this.input instanceof AudioBuffer ) {
				resolve( this.input );
				this.done( this.input );
			} else if ( this.input instanceof ArrayBuffer ) {
				Context.onInit( () => {
					Context.context.decodeAudioData( this.input, ( audio ) => {
						resolve( audio );
						this.done( audio );
					});
				});
			} else {
				const xhr = new XMLHttpRequest();
				xhr.open( 'GET', this.input );
				xhr.responseType = 'arraybuffer';
				xhr.onreadystatechange = () => {
					if ( xhr.readyState === 4 ) {
						if ( xhr.status === 200 ) {
							Context.onInit( () => {
								Context.context.decodeAudioData( xhr.response, ( audio ) => {
									resolve( audio );
									this.done( audio );
								});
							});
						} else {
							console.error( `Failed to load "${this.input}"` );
							reject();
						}
					}
				};
				xhr.onprogress = e => this.dispatchEvent( 'loading', e.loaded / e.total );
				xhr.send();
			}
		});
	}


	done( audio ) {
		this.input = null;
		this.dispatchEvent( 'loading', 1 );
		this.dispatchEvent( 'load', audio );
	}
}
