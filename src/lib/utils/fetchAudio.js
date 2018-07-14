import Context from '../Context';


export default function fetchAudio( file ) {
	return new Promise( ( resolve, reject ) => {
		fetch( file )
			.then( response => response.arrayBuffer() )
			.then( ( buffer ) => {
				Context.onInit( () => {
					Context.context.decodeAudioData( buffer, audio => resolve( audio ) );
				});
			})
			.catch( ( e ) => {
				console.error( `Failed to load "${file}"`, e );
				reject();
			});
	});
}
