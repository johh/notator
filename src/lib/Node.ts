
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
			this.invalidateChildren( () => {
				this.parents.push( parent );
			});
		}
	}


	protected removeParent( parent: Node ): void {
		if ( this.parents.includes( parent ) ) {
			this.invalidateChildren( () => {
				this.parents.splice( this.parents.findIndex( p => p === parent ), 1 );
			});
		}
	}


	protected invalidateChildren( intermediateStep?: () => void ): void {
		// not very elegant. this should only rebuild connections
		if ( this.children.length > 0 ) {
			const children = Array.from( this.children );
			this.disconnect( ...children );
			if ( intermediateStep ) intermediateStep();
			this.connect( ...children );

			if ( this.autoInvalidateChildren ) children.forEach( c => c.invalidateChildren() );
		}
	}


	public getOutputAudioNodes(): AudioNode[] {
		return this.parents.map( c => c.getOutputAudioNodes() ).flat();
	}
}

