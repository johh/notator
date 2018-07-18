export default function lerp( val, min, max ) {
	return ( ( max - min ) * val ) + min;
}
