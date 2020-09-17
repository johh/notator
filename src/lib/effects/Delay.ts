import EffectNode from './EffectNode';


export interface DelayProps {
	delayTime?: number;
}

export default class Delay extends EffectNode<DelayNode> {
	constructor({
		delayTime = 0,
	}: DelayProps = {}) {
		super( ( ctx ) => {
			const node = ctx.createDelay();
			node.delayTime.value = delayTime;
			return node;
		});
	}
}
