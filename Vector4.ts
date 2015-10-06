export default class Vector4 {
	array: Float32Array;

	constructor(x: number = 0, y: number = 0, z: number = 0, w: number = 0) {
		this.array = new Float32Array(4);

		this.array[0] = x;
		this.array[1] = y;
		this.array[2] = z;
		this.array[3] = w;
	}

	toString() {
		return `Vector4 (${this.x}, ${this.y}, ${this.z}, ${this.w})`;
	}

	get x() {
		return this.array[0];
	}

	get y() {
		return this.array[1];
	}

	get z() {
		return this.array[2];
	}

	get w() {
		return this.array[3];
	}

	copy(other: Vector4 = new Vector4()) {
		other.array.set(this.array);

		return other;
	}

	set(x: number, y: number, z: number, w: number) {
		this.array[0] = x;
		this.array[1] = y;
		this.array[2] = z;
		this.array[3] = w;

		return this;
	}

	addVector(other: Vector4, out: Vector4 = this) {
		this.add(
			other.array[0],
			other.array[1],
			other.array[2],
			other.array[3],
			out
		);

		return out;
	}

	add(x: number, y: number, z: number, w: number, out: Vector4 = this) {
		out.set(
			this.array[0] + x,
			this.array[1] + y,
			this.array[2] + z,
			this.array[3] + w
		);

		return out;
	}

	subtractVector(other: Vector4, out: Vector4 = this) {
		this.subtract(
			other.array[0],
			other.array[1],
			other.array[2],
			other.array[3],
			out
		);

		return out;
	}

	subtract(x: number, y: number, z: number, w: number, out: Vector4 = this) {
		out.set(
			this.array[0] - x,
			this.array[1] - y,
			this.array[2] - z,
			this.array[3] - w
		);

		return out;
	}

	multiply(x2, y2, z2, w2, out: Vector4 = this) {
		let x1 = this.x;
		let y1 = this.y;
		let z1 = this.z;
		let w1 = this.w;

		out.set(
			w1*x2 + x1*w2 + y1*z2 - z1*y2,
			w1*y2 - x1*z2 + y1*w2 + z1*x2,
			w1*z2 + x1*y2 - y1*x2 + z1*w2,
			w1*w2 - x1*x2 - y1*y2 - z1*z2
		);

		return out;
	}

	multiplyVector(other: Vector4, out: Vector4 = this) {
		this.multiply(other.x, other.y, other.z, other.w, out);

		return out;
	}

	dotVector(other: Vector4) {
		return this.dot(other.x, other.y, other.z, other.w);
	}

	dot(x: number, y: number, z: number, w: number) {
		return this.x * x + this.y * y + this.z * z + this.w * w;
	}

	lerpVector(other: Vector4, t: number, out: Vector4 = this) {
		this.lerp(
			other.array[0],
			other.array[1],
			other.array[2],
			other.array[3],
			t,
			out
		);

		return out;
	}

	lerp(x: number, y: number, z: number, w: number, t: number, out: Vector4 = this) {
		let tx = this.array[0];
		let ty = this.array[1];
		let tz = this.array[2];
		let tw = this.array[3];

		out.set(
			tx + t * (x - tx),
			ty + t * (y - ty),
			tz + t * (z - tz),
			tw + t * (w - tw)
		);

		return out;
	}

	negate(out: Vector4 = this) {
		out.set(
			-this.array[0],
			-this.array[1],
			-this.array[2],
			-this.array[3]
		);

		return out;
	}

	scale(scalar: number, out: Vector4 = this) {
		out.set(
			this.array[0] * scalar,
			this.array[1] * scalar,
			this.array[2] * scalar,
			this.array[3] * scalar
		);

		return out;
	}

	normalize(out: Vector4 = this) {
		let x = this.array[0];
		let y = this.array[1];
		let z = this.array[2];
		let w = this.array[3];

		let len = Math.sqrt(x*x + y*y * z*z + w*w);

		if (len > 0) {
			out.set(x / len, y / len, z / len, w / len);
		} else {
			out.set(x, y, z, w);
		}

		return out;
	}

	magnitude() {
		let x = this.array[0];
		let y = this.array[1];
		let z = this.array[2];
		let w = this.array[3];

		return Math.sqrt(x*x + y*y + z*z + w*w);
	}

	magnitudeSquare() {
		let x = this.array[0];
		let y = this.array[1];
		let z = this.array[2];
		let w = this.array[3];

		return x*x + y*y + z*z + w*w;
	}
}