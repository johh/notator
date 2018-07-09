import Context from '../Context';


export default function fetchAudio( file ) {
	return new Promise( ( resolve, reject ) => {
		Context.onInit( () => {
			fetch( file )
				.then( response => response.arrayBuffer() )
				.then( buffer => Context.context.decodeAudioData( buffer ) )
				.then( ( audio ) => {
					resolve( audio );
				})
				.catch( ( e ) => {
					console.error( `Failed to load "${file}"`, e );
					reject();
				});
		});
	});
}
