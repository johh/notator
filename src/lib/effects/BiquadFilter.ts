import EffectNode from './EffectNode';


export interface BiquadFilterProps {
	frequency?: number;
	detune?: number;
	Q?: number;
	gain?: number;
}

interface StaticBiquadFilterProps extends BiquadFilterProps {
	type?: 'lowpass'|'highpass'|'bandpass'|'lowshelf'|'highshelf'|'peaking'|'notch'|'allpass';
}

export default class BiquadFilter extends EffectNode<BiquadFilterNode> {
	constructor({
		type = 'lowpass',
		frequency = 350,
		detune = 0,
		Q = 1,
		gain = 1,
	}: StaticBiquadFilterProps = {}) {
		super( ( ctx ) => {
			const node = ctx.createBiquadFilter();
			node.type = type;
			node.frequency.value = frequency;
			node.detune.value = detune;
			node.Q.value = Q;
			node.gain.value = gain;
			return node;
		});
	}
}
