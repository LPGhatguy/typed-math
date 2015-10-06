import IntVector3 from "./IntVector3";

export default class Vector3 {
	array: Float32Array;

	constructor(x: number = 0, y: number = 0, z: number = 0) {
		this.array = new Float32Array(3);

		this.array[0] = x;
		this.array[1] = y;
		this.array[2] = z;
	}

	toString() {
		return `Vector3 (${this.x}, ${this.y}, ${this.z})`;
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

	copy(other: Vector3|IntVector3 = new Vector3()) {
		other.array.set(this.array);

		return other;
	}

	set(x: number, y: number, z: number) {
		this.array[0] = x;
		this.array[1] = y;
		this.array[2] = z;

		return this;
	}

	addVector(other: Vector3, out: Vector3 = this) {
		this.add(
			other.array[0],
			other.array[1],
			other.array[2],
			out
		);

		return out;
	}

	add(x: number, y: number, z: number, out: Vector3 = this) {
		out.set(
			this.array[0] + x,
			this.array[1] + y,
			this.array[2] + z
		);

		return out;
	}

	subtractVector(other: Vector3, out: Vector3 = this) {
		this.subtract(
			other.array[0],
			other.array[1],
			other.array[2],
			out
		);

		return out;
	}

	subtract(x: number, y: number, z: number, out: Vector3 = this) {
		out.set(
			this.array[0] - x,
			this.array[1] - y,
			this.array[2] - z
		);

		return out;
	}

	dotVector(other: Vector3) {
		return this.dot(other.x, other.y, other.z);
	}

	dot(x: number, y: number, z: number) {
		return this.x * x + this.y * y + this.z * z;
	}

	crossVector(other: Vector3, out: Vector3 = this) {
		this.cross(other.x, other.y, other.z, out);

		return out;
	}

	cross(x: number, y: number, z: number, out: Vector3 = this) {
		let tx = this.array[0];
		let ty = this.array[1];
		let tz = this.array[2];

		out.set(
			ty * z - tz * y,
			tz * x - tx * z,
			tx * y - ty * x
		);

		return out;
	}

	lerpVector(other: Vector3, t: number, out: Vector3 = this) {
		this.lerp(
			other.array[0],
			other.array[1],
			other.array[2],
			t,
			out
		);

		return out;
	}

	lerp(x: number, y: number, z: number, t: number, out: Vector3 = this) {
		let tx = this.array[0];
		let ty = this.array[1];
		let tz = this.array[2];

		out.set(
			tx + t * (x - tx),
			ty + t * (y - ty),
			tz + t * (z - tz)
		);

		return out;
	}

	negate(out: Vector3 = this) {
		out.set(
			-this.array[0],
			-this.array[1],
			-this.array[2]
		);

		return out;
	}

	scale(scalar: number, out: Vector3 = this) {
		out.set(
			this.array[0] * scalar,
			this.array[1] * scalar,
			this.array[2] * scalar
		);

		return out;
	}

	normalize(out: Vector3 = this) {
		let x = this.array[0];
		let y = this.array[1];
		let z = this.array[2];

		let len = Math.sqrt(x*x + y*y * z*z);

		if (len > 0) {
			out.set(x / len, y / len, z / len);
		} else {
			out.set(x, y, z);
		}

		return out;
	}

	magnitude() {
		let x = this.array[0];
		let y = this.array[1];
		let z = this.array[2];

		return Math.sqrt(x*x + y*y + z*z);
	}

	magnitudeSquare() {
		let x = this.array[0];
		let y = this.array[1];
		let z = this.array[2];

		return x*x + y*y + z*z;
	}
}