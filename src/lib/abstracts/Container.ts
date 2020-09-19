import type Timeline from '../Timeline';
import type { Effect } from '../effects/Effect';
import Bus from '../Bus';


export interface ContainerProps {
	effects?: Effect[];
}


export default abstract class Container {
	protected timeline: Timeline;
	public readonly bus: Bus;

	constructor({
		effects = [],
	}: ContainerProps ) {
		this.bus = new Bus({
			effects,
		});
	}


	public bindTimeline( timeline: Timeline ): void {
		this.timeline = timeline;
	}


	public destroy(): void {
		this.bus.destroy();
	}
}
