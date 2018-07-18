export default class ConnectionReference {
	constructor({
		src = {
			node: null,
			connectable: null,
		},
		target = {
			node: null,
			connectable: null,
		},
	} = {}) {
		this.src = src;
		this.target = target;
	}
}
