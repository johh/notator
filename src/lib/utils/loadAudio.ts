import defaultContext from '../defaultContext';


export default function loadAudio(
	input: AudioBuffer | ArrayBuffer | string,
): Promise<AudioBuffer> {
	return new Promise( ( resolve, reject ) => {
		if ( input instanceof AudioBuffer ) {
			resolve( input );
		} else if ( input instanceof ArrayBuffer ) {
			defaultContext.ready( () => {
				defaultContext.context.decodeAudioData( input, ( audio ) => {
					resolve( audio );
				});
			});
		} else {
			fetch( input ).then(
				response => response.arrayBuffer(),
			).then( ( buffer ) => {
				defaultContext.ready( ( ctx ) => {
					ctx.decodeAudioData( buffer ).then(
						( audio ) => resolve( audio ),
					).catch(
						() => {
							// eslint-disable-next-line no-console
							console.error( `Error decoding file ${input}` );
							reject();
						},
					);
				});
			}).catch(
				() => {
					// eslint-disable-next-line no-console
					console.error( `Error loading file ${input}` );
					reject();
				},
			);
		}
	});
}