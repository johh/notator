import EffectNode from './EffectNode';


export interface GainProps {
	gain?: number;
}

export default class Gain extends EffectNode<GainNode> {
	constructor({
		gain = 1,
	}: GainProps = {}) {
		super( ( ctx ) => {
			const node = ctx.createGain();
			node.gain.value = gain;
			return node;
		});
	}
}
