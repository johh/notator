import type Context from '../Context';
import BiquadFilter, { BiquadFilterProps } from './BiquadFilter';
import Delay, { DelayProps } from './Delay';
import DynamicsCompressor, { DynamicsCompressorProps } from './DynamicsCompressor';
import Gain, { GainProps } from './Gain';
import defaultContext from '../defaults/defaultContext';


type ControllableNode = BiquadFilter | Delay | DynamicsCompressor | Gain;

interface EffectControllerType {
	new ( props: EffectControllerProps<Gain> ): AccessorProps<Gain, GainProps>;
}
interface EffectControllerType {
	new ( props: EffectControllerProps<Delay> ): AccessorProps<Delay, DelayProps>;
}
interface EffectControllerType {
	new ( props: EffectControllerProps<BiquadFilter> ):
	AccessorProps<BiquadFilter, BiquadFilterProps>;
}
interface EffectControllerType {
	new ( props: EffectControllerProps<DynamicsCompressor> ):
	AccessorProps<DynamicsCompressor, DynamicsCompressorProps>;
}

interface AccessorProps<T, P> {
	set: ( key: keyof OmitThisParameter<Omit<P, 'context'>>, value: number ) => void;
	add: ( ...nodes: T[]) => void;
	remove: ( ...nodes: T[]) => void;
}


interface EffectControllerProps<T>{
	effects: T[];
	smoothing?: number;
	context?: Context;
}

const EffectController: EffectControllerType = class EffectController {
	private smoothing: number;
	private context: Context;
	public effects: ControllableNode[];

	constructor({
		effects,
		smoothing = .001,
		context = defaultContext,
	}: EffectControllerProps<ControllableNode> ) {
		this.effects = effects;
		this.smoothing = smoothing;
		this.context = context;
	}


	public set( key: string, value: number ): void {
		if ( this.context.initialized ) {
			this.effects.forEach( ( effect ) => {
				const n = effect.getControllerTarget();
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const param = ( ( n as any )[key] as AudioParam );
				param.cancelScheduledValues( 0 );
				param.setTargetAtTime( value, 0, this.smoothing );
			});
		}
	}


	public add( ...nodes: ControllableNode[]): void {
		nodes.forEach( ( node ) => {
			if ( !this.effects.includes( node ) ) {
				this.effects.push( node );
			}
		});
	}


	public remove( ...nodes: ControllableNode[]): void {
		nodes.forEach( node => {
			if ( this.effects.includes( node ) ) {
				this.effects.splice( this.effects.findIndex( n => n === node ), 1 );
			}
		});
	}
};

export default EffectController;
