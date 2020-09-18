import type Part from './Part';
import type Destination from './Destination';
import type Context from './Context';
import { Effect } from './effects/Effect';
import Bus from './Bus';
import defaultContext from './defaults/defaultContext';
import defaultDestination from './defaults/defaultDestination';


interface TimelineProps {
	bpm: number;
	mesure?: number;
	lookahead?: number;
	effects?: Effect[];
	context?: Context;
	destination?: Destination;
}

export default class Timeline {
	private readonly lookahead: number;
	private started = false;
	private startTime = 0;
	private nextPartStart = 0;
	private currentPart: Part;
	public readonly context: Context;
	public readonly barDuration: number;
	public readonly bus: Bus;
	public queue: Part[] = [];

	constructor({
		bpm = 60,
		mesure = 4 / 4,
		lookahead = .25,
		effects = [],
		context = defaultContext,
		destination = defaultDestination,
	}: TimelineProps ) {
		this.context = context;
		this.barDuration = 60 / ( bpm / ( mesure * 4 ) );
		this.lookahead = lookahead;
		this.bus = new Bus({
			effects,
		});

		this.bus.connect( destination );
	}


	public cue( part: Part ): void {
		this.queue.push( part );
		part.bindTimeline( this );

		if ( !this.started ) {
			this.started = true;
			this.startTime = this.context.context.currentTime
				+ this.lookahead * this.barDuration;
			this.nextPartStart = this.startTime;
			this.updateState();
		}
	}


	private updateState(): void {
		if ( this.queue.length > 0 ) {
			// next part has been cued
			this.currentPart = this.queue.shift();
		} else if ( !this.currentPart || !this.currentPart.loop ) {
			// no next part or part to loop
			this.currentPart.bus.disconnect( this.bus );
			this.currentPart = null;
		}
		// otherwhise loop the current part

		if ( this.currentPart ) {
			this.currentPart.play( this.nextPartStart );
			this.nextPartStart += this.currentPart.duration * this.barDuration;

			setTimeout( () => this.updateState(), this.getTimeoutForTime( this.nextPartStart ) );
		} else {
			this.started = false;
		}
	}


	public getPosition(): number {
		return ( this.context.getTime() - this.startTime ) / this.barDuration;
	}


	public getTimeAtPosition( position: number ): number {
		return this.startTime + ( position * this.barDuration );
	}


	public getTimeUntilPosition( position: number ): number {
		return this.getTimeAtPosition( position ) - this.context.getTime();
	}


	public getTimeoutForPosition( position: number ): number {
		return Math.max(
			0,
			( this.getTimeUntilPosition( position ) - this.barDuration * this.lookahead ) * 1000,
		);
	}

	public getTimeoutForTime( time: number ): number {
		return Math.max(
			0,
			( ( time - this.context.getTime() ) - this.barDuration * this.lookahead ) * 1000,
		);
	}
}
