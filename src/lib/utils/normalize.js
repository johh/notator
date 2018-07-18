function clamp( val, min = 0, max = 1 ) {
	return Math.min( Math.max( val, Math.min( min, max ) ), Math.max( min, max ) );
}


export default function normalize( val, min, max, _clamp = false ) {
	if ( _clamp ) return clamp( ( val - min ) / ( max - min ) );
	return ( val - min ) / ( max - min );
}
