import type Context from '../Context';
import Node from './Node';
import defaultContext from '../defaults/defaultContext';


export interface OperativeNodeProps {
	context?: Context;
}

export default abstract class OperativeNode extends Node {
	private upstreamNodes: AudioNode[] = [];
	protected context: Context;
	public node: AudioNode;

	// since all children are connected to a single AudioNode,
	// they won't be affected by upstream changes.
	// the node does not yet exist though, so downstream
	// connections will have to change once it does.
	protected autoInvalidateChildren = true;

	constructor({
		context = defaultContext,
	}: OperativeNodeProps = {}) {
		super();

		this.context = context;
	}


	protected bindNode( node: AudioNode ): void {
		this.node = node;
		this.invalidateConnections();
		// the node has been initialised,
		// downstream connections will no longer change
		this.autoInvalidateChildren = false;
	}


	private rebuildUpstreamConnections(): void {
		const currentNodes = this.parents.map( p => p.getOutputAudioNodes() ).flat();

		const disconnectedNodes = this.upstreamNodes.filter( n => !currentNodes.includes( n ) );
		const newNodes = currentNodes.filter( n => !this.upstreamNodes.includes( n ) );

		disconnectedNodes.forEach( n => {
			this.upstreamNodes.splice( this.upstreamNodes.findIndex( n2 => n2 === n ), 1 );
			n.disconnect( this.node );
		});
		newNodes.forEach( n => {
			this.upstreamNodes.push( n );
			n.connect( this.node );
		});
	}


	protected invalidateConnections(): void {
		this.rebuildUpstreamConnections();
		super.invalidateConnections();
	}


	public getOutputAudioNodes(): AudioNode[] {
		return this.node ? [this.node] : [];
	}
}
