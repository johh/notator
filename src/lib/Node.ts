
export default class Node {
	public parents: Node[] = [];
	public children: Node[] = [];


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
		}
	}


	protected removeParent( parent: Node ): void {
		if ( this.parents.includes( parent ) ) {
			this.parents.splice( this.parents.findIndex( p => p === parent ), 1 );
		}
	}


	public getOutputAudioNodes(): AudioNode[] {
		return this.parents.map( c => c.getOutputAudioNodes() ).flat();
	}
}

