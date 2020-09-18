import { OperativeNodeProps } from '../abstracts/OperativeNode';
import EffectNode from './EffectNode';


export interface DelayProps extends OperativeNodeProps {
	delayTime?: number;
}

export default class Delay extends EffectNode<DelayNode> {
	constructor({
		delayTime = 0,
		...rest
	}: DelayProps = {}) {
		super( ( ctx ) => {
			const node = ctx.createDelay();
			node.delayTime.value = delayTime;
			return node;
		}, rest );
	}
}
