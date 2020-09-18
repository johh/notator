import { OperativeNodeProps } from '../abstracts/OperativeNode';
import EffectNode from './EffectNode';


export interface DynamicsCompressorProps extends OperativeNodeProps{
	threshold?: number;
	knee?: number;
	ratio?: number;
	attack?: number;
	release?: number;
}

export default class DynamicsCompressor extends EffectNode<DynamicsCompressorNode> {
	constructor({
		threshold = -24,
		knee = 30,
		ratio = 12,
		attack = .003,
		release = .25,
		...rest
	}: DynamicsCompressorProps = {}) {
		super( ( ctx ) => {
			const node = ctx.createDynamicsCompressor();
			node.threshold.value = threshold;
			node.knee.value = knee;
			node.ratio.value = ratio;
			node.attack.value = attack;
			node.release.value = release;
			return node;
		}, rest );
	}
}
