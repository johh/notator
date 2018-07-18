import Connectable from './Connectable';
import Context from './Context';


class Destination extends Connectable {
	instanced = false


	createNode( srcNode ) {
		srcNode.connect( Context.context.destination );
	}


	removeNode( srcNode ) {
		srcNode.disconnect( Context.context.destination );
	}
}

export default new Destination();
