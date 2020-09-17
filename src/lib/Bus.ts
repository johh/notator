import Node from './Node';
import { Effect } from './effects/Effect';


interface BusProps {
	effects?: Effect[];
}


export default class Bus extends Node {
	effects: Effect[];

	constructor({
		effects = [],
	}: BusProps ) {
		super();
		this.effects = effects;

		if ( effects.length > 0 ) this.autoInvalidateChildren = false;

		for ( let i = 0; i < effects.length - 1; i += 1 ) {
			effects[i].connect( effects[i + 1]);
		}
	}

	public addParent( parent: Node ): void {
		super.addParent( parent );
		parent.connect( this.effects[0]);
	}


	public removeParent( parent: Node ): void {
		parent.disconnect( this.effects[0]);
		super.removeParent( parent );
	}


	public getOutputAudioNodes(): AudioNode[] {
		return this.effects[this.effects.length - 1].getOutputAudioNodes();
	}
}
