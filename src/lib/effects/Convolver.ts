import type { OperativeNodeProps } from '../abstracts/OperativeNode';
import type { Src } from '../Source';
import EffectNode from './EffectNode';
import loadAudio from '../utils/loadAudio';


interface ConvolverProps extends OperativeNodeProps {
	ir: Src;
	normalize?: boolean;
}

export default class Convolver extends EffectNode<ConvolverNode> {
	constructor({
		ir,
		normalize = true,
		...rest
	}: ConvolverProps ) {
		super( ( ctx ) => {
			const node = ctx.createConvolver();
			node.normalize = normalize;
			return node;
		}, rest );

		loadAudio( ir, this.context ).then( ( audio ) => {
			this.context.ready( () => {
				this.node.buffer = audio;
			});
		});
	}
}
