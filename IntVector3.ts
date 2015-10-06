import Vector3 from "./Vector3";

export default class IntVector3 {
	array: Int32Array;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.array = new Int32Array(3);

		this.array[0] = x;
		this.array[1] = y;
		this.array[2] = z;
	}

	toString() {
		return `IntVector3 (${this.x}, ${this.y}, ${this.z})`;
	}

	get x() {
		return this.array[0];
	}

	set x(value) {
		this.array[0] = value;
	}

	get y() {
		return this.array[1];
	}

	set y(value) {
		this.array[1] = value;
	}

	get z() {
		return this.array[2];
	}

	set z(value) {
		this.array[2] = value;
	}

	copy(other: IntVector3|Vector3 = new IntVector3()) {
		other.array.set(this.array);

		return other;
	}

	set(x: number, y: number, z: number) {
		this.array[0] = x;
		this.array[1] = y;
		this.array[2] = z;

		return this;
	}
}