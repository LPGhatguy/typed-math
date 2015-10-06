import Vector4 from "./Vector4";
import Vector3 from "./Vector3";

/**
 * Represents a 3-space rotation
 */
export default class Quaternion extends Vector4 {
	constructor(x = 0, y = 0, z = 0, w = 1) {
		super(x, y, z, w);
	}

	conjugate(out: Quaternion = this) {
		out.x = -this.x;
		out.y = -this.y;
		out.z = -this.z;
		out.w = this.w;

		return out;
	}

	/**
	 * Copies the quaternion into another quaternion
	 * Defaults to allocating a new quaternion.
	 */
	copy(other: Quaternion = new Quaternion()) {
		other.set(this.array[0], this.array[1], this.array[2], this.array[3]);

		return other;
	}

	setFromEuler(x, y, z) {
		let c1 = Math.cos(x / 2);
		let c2 = Math.cos(y / 2);
		let c3 = Math.cos(z / 2);
		let s1 = Math.sin(x / 2);
		let s2 = Math.sin(y / 2);
		let s3 = Math.sin(z / 2);

		return this.set(
			(s1 * s2 * c3) + (c1 * c2 * s3),
			(s1 * c2 * c3) + (c1 * s2 * s3),
			(c1 * s2 * c3) - (s1 * c2 * s3),
			(c1 * c2 * c3) - (s1 * s2 * s3)
		);
	}

	transform(x, y, z, out: Vector3 = new Vector3()) {
		let temp = this.multiply(x, y, z, 0, new Vector4());
		temp.multiply(-this.x, -this.y, -this.z, this.w);

		out.set(temp.x, temp.y, temp.z);

		return out;
	}

	transformVector(vec: Vector3, out: Vector3 = vec) {
		this.transform(vec.x, vec.y, vec.z, out);

		return out;
	}

	slerpQuaternion(other: Quaternion, out: Quaternion = this) {
		this.slerp(other.x, other.y, other.z, other.w, out);

		return out;
	}

	slerp(x2, y2, z2, w2, t, out: Quaternion = this) {
		let cos_half_theta = this.dot(x2, y2, z2, w2);
		if (Math.abs(cos_half_theta) >= 1) {
			return this.copy(out);
		}

		let half_theta = Math.acos(cos_half_theta);
		let sin_half_theta = Math.sqrt(1 - Math.pow(cos_half_theta, 2));

		if (Math.abs(sin_half_theta) < 1e-4) {
			return out.set(
				this.x * 0.5 + x2 * 0.5,
				this.y * 0.5 + y2 * 0.5,
				this.z * 0.5 + z2 * 0.5,
				this.w * 0.5 + w2 * 0.5
			);
		}

		let r_a = Math.sin((1 - t) * half_theta) / sin_half_theta;
		let r_b = Math.sin(t * half_theta) / sin_half_theta;

		return out.set(
			this.x * r_a + x2 * r_b,
			this.y * r_a + y2 * r_b,
			this.z * r_a + z2 * r_b,
			this.w * r_a + w2 * r_b
		);
	}
}