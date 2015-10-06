import Quaternion from "./Quaternion";
import Matrix4x4 from "./Matrix4x4";
import Vector3 from "./Vector3";

export default class Orientation {
	quaternion: Quaternion;
	dirty: boolean = true;
	private matrix: Matrix4x4;

	constructor() {
		this.quaternion = new Quaternion();
		this.matrix = new Matrix4x4();
	}

	recalculateMatrix() {
		this.dirty = false;

		this.matrix.setQuaternion(
			this.quaternion.x,
			this.quaternion.y,
			this.quaternion.z,
			this.quaternion.w
		);
	}

	getMatrix() {
		if (this.dirty) {
			this.recalculateMatrix();
		}

		return this.matrix;
	}

	transformVector(vec: Vector3, out: Vector3 = vec) {
		this.quaternion.transformVector(vec, out);
	}
}