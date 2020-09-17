import EffectNode from './EffectNode';
import { Src } from '../Source';
import loadAudio from '../utils/loadAudio';
import defaultContext from '../defaultContext';


interface ConvolverProps {
	ir: Src;
	normalize?: boolean;
}

export default class Convolver extends EffectNode<ConvolverNode> {
	constructor({
		ir,
		normalize = true,
	}: ConvolverProps ) {
		super( ( ctx ) => {
			const node = ctx.createConvolver();
			node.normalize = normalize;
			return node;
		});

		loadAudio( ir ).then( ( audio ) => {
			defaultContext.ready( () => {
				this.node.buffer = audio;
			});
		});
	}
}
