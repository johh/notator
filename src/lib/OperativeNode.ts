import Node from './Node';
import defaultContext from './defaultContext';


export default abstract class OperativeNode extends Node {
	public node: AudioNode;

	// since all children are connected to a single AudioNode,
	// they won't be affected by upstream changes.
	protected autoInvalidateChildren = false;


	public addParent( parent: Node ): void {
		super.addParent( parent );
		defaultContext.ready( () => {
			parent.getOutputAudioNodes().forEach( ( node ) => {
				node.connect( this.node );
			});
		});
	}


	public removeParent( parent: Node ): void {
		defaultContext.ready( () => {
			parent.getOutputAudioNodes().forEach( ( node ) => {
				node.disconnect( this.node );
			});
		});
		super.removeParent( parent );
	}


	public getOutputAudioNodes(): AudioNode[] {
		return [this.node];
	}
}
