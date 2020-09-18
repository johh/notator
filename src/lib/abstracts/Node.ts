
export default class Node {
	public parents: Node[] = [];
	public children: Node[] = [];
	protected autoInvalidateChildren = true;


	public connect( ...children: Node[]): void {
		children.forEach( child => {
			if ( !this.children.includes( child ) ) {
				child.addParent( this );
				this.children.push( child );
			}
		});
	}


	public disconnect( ...children: Node[]): void {
		children.forEach( child => {
			if ( this.children.includes( child ) ) {
				child.removeParent( this );
				this.children.splice( this.children.findIndex( c => c === child ), 1 );
			}
		});
	}


	protected addParent( parent: Node ): void {
		if ( !this.parents.includes( parent ) ) {
			this.parents.push( parent );
			this.invalidateConnections();
		}
	}


	protected removeParent( parent: Node ): void {
		if ( this.parents.includes( parent ) ) {
			this.parents.splice( this.parents.findIndex( p => p === parent ), 1 );
			this.invalidateConnections();
		}
	}


	protected invalidateConnections(): void {
		if ( this.autoInvalidateChildren && this.children.length > 0 ) {
			// if upstream changes may affect the connections of children,
			// they need to be invalidated aswell.
			this.children.forEach( c => c.invalidateConnections() );
		}
	}


	public getOutputAudioNodes(): AudioNode[] {
		return this.parents.map( c => c.getOutputAudioNodes() ).flat();
	}


	public destroy(): void {
		this.disconnect( ...this.children );
		this.parents.forEach( p => p.disconnect( this ) );
	}
}

