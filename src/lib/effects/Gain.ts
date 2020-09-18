import { OperativeNodeProps } from '../abstracts/OperativeNode';
import EffectNode from './EffectNode';


export interface GainProps extends OperativeNodeProps {
	gain?: number;
}

export default class Gain extends EffectNode<GainNode> {
	constructor({
		gain = 1,
		...rest
	}: GainProps = {}) {
		super( ( ctx ) => {
			const node = ctx.createGain();
			node.gain.value = gain;
			return node;
		}, rest );
	}
}
