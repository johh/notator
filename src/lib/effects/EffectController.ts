import BiquadFilter, { BiquadFilterProps } from './BiquadFilter';
import Delay, { DelayProps } from './Delay';
import DynamicsCompressor, { DynamicsCompressorProps } from './DynamicsCompressor';
import Gain, { GainProps } from './Gain';
import defaultContext from '../defaultContext';


type ControllableNode = BiquadFilter | Delay | DynamicsCompressor | Gain;


interface EffectControllerProps<T>{
	effects: T[];
	smoothing?: number;
}


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
	set: ( key: keyof P, value: number ) => void;
	connect: ( ...nodes: T[]) => void;
	disconnect: ( ...nodes: T[]) => void;
}


const EffectController: EffectControllerType = class EffectController {
	public effects: ControllableNode[];
	private smoothing: number;

	constructor({
		effects,
		smoothing = .001,
	}: EffectControllerProps<ControllableNode> ) {
		this.effects = effects;
		this.smoothing = smoothing;
	}

	// eslint-disable-next-line class-methods-use-this
	public set( key: string, value: number ): void {
		if ( defaultContext.initialized ) {
			this.effects.forEach( ( effect ) => {
				const n = effect.getControllerTarget();
				// eslint-disable-next-line @typescript-eslint/no-explicit-any
				const param = ( ( n as any )[key] as AudioParam );
				param.cancelScheduledValues( 0 );
				param.setTargetAtTime( value, 0, this.smoothing );
			});
		}
	}


	public connect( ...nodes: ControllableNode[]): void {
		nodes.forEach( ( node ) => {
			if ( !this.effects.includes( node ) ) {
				this.effects.push( node );
			}
		});
	}


	public disconnect( ...nodes: ControllableNode[]): void {
		nodes.forEach( node => {
			if ( this.effects.includes( node ) ) {
				this.effects.splice( this.effects.findIndex( n => n === node ), 1 );
			}
		});
	}
};

export default EffectController;
