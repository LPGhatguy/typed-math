import Vector3 from "./Vector3";

/**
 * Represents a 3-space transformation
 */
export default class Matrix4x4 {
	array: Float32Array;

	constructor(
		a = 1, b = 0, c = 0, d = 0,
		e = 0, f = 1, g = 0, h = 0,
		i = 0, j = 0, k = 1, l = 0,
		m = 0, n = 0, o = 0, p = 1) {

		let arr = new Float32Array(16);
		this.array = arr;

		this.set(
			a, b, c, d,
			e, f, g, h,
			i, j, k, l,
			m, n, o, p
		);
	}

	toString(): string {
		let a = this.array;

		return `
${a[0]}, ${a[1]}, ${a[2]}, ${a[3]},
${a[4]}, ${a[5]}, ${a[6]}, ${a[7]},
${a[8]}, ${a[9]}, ${a[10]}, ${a[11]},
${a[12]}, ${a[13]}, ${a[14]}, ${a[15]}`.slice(1);
	}

	/**
	 * Copies this matrix to another one.
	 */
	copy(other: Matrix4x4 = new Matrix4x4()) {
		other.array.set(this.array);

		return other;
	}

	/**
	 * Sets values for the matrix.
	 */
	set(
		a = 1, b = 0, c = 0, d = 0,
		e = 0, f = 1, g = 0, h = 0,
		i = 0, j = 0, k = 1, l = 0,
		m = 0, n = 0, o = 0, p = 1) {

		let arr = this.array;
		arr[0] = a;
		arr[1] = b;
		arr[2] = c;
		arr[3] = d;
		arr[4] = e;
		arr[5] = f;
		arr[6] = g;
		arr[7] = h;
		arr[8] = i;
		arr[9] = j;
		arr[10] = k;
		arr[11] = l;
		arr[12] = m;
		arr[13] = n;
		arr[14] = o;
		arr[15] = p;
	}

	/**
	 * Sets the transformation to be a rotation from the given quaternion.
	 */
	setQuaternion(x: number, y: number, z: number, w: number) {
		let tx = x + x;
		let ty = y + y;
		let tz = z + z;

		let twx = tx * w;
		let twy = ty * w;
		let twz = tz * w;

		let txx = tx * x;
		let txy = ty * x;
		let txz = tz * x;

		let tyy = ty * y;
		let tyz = tz * y;
		let tzz = tz * z;

		this.set(
			1 - (tyy + tzz), txy - twz, txz + twy, 0,
			txy + twz, 1 - (txx + tzz), tyz - twx, 0,
			txz - twy, tyz + twx, 1 - (txx + tyy), 0,
			0, 0, 0, 1
		);

		return this;
	}

	/**
	 * Creates the transformation to be a rotation from the given quaternion.
	 */
	static fromQuaternion(x: number, y: number, z: number, w: number) {
		let instance = new Matrix4x4();

		instance.setQuaternion(x, y, z, w);

		return instance;
	}

	/**
	 * Sets the transformation to be an orthographic view matrix.
	 */
	setOrthographic(left: number, right: number, top: number, bottom: number, near: number, far: number) {
		this.set(
			2 / (right - left), 0, 0, -((right + left)/(right - left)),
			0, 2 / (top - bottom), 0, -((top + bottom)/(top - bottom)),
			0, 0, -2 / (far - near), 0,
			0, 0, -(far + near)/(far - near), 1
		);

		return this;
	}

	/**
	 * Creates a new transform representnig an orthographic view.
	 */
	static newOrthographic(left: number, right: number, top: number, bottom: number, near: number, far: number) {
		let instance = new Matrix4x4(
			2 / (right - left), 0, 0, -((right + left)/(right - left)),
			0, 2 / (top - bottom), 0, -((top + bottom)/(top - bottom)),
			0, 0, -2 / (far - near), 0,
			0, 0, -(far + near)/(far - near), 1
		);

		return instance;
	}

	/**
	 * Sets the transformation to be a perspective view matrix.
	 */
	setPerspective(fov: number, aspect: number, near: number, far: number) {
		let t = Math.tan(fov / 2);

		this.set(
			1 / (aspect * t), 0, 0, 0,
			0, 1 / t, 0, 0,
			0, 0, -(far + near) / (far - near), -1,
			0, 0, -(2 * far * near) / (far - near), 1
		);

		return this;
	}

	/**
	 * Creates a new transform representnig a perspective view.
	 */
	static newPerspective(fov: number, aspect: number, near: number, far: number) {
		let t = Math.tan(fov / 2);

		let instance = new Matrix4x4(
			1 / (aspect * t), 0, 0, 0,
			0, 1 / t, 0, 0,
			0, 0, -(far + near) / (far - near), -1,
			0, 0, -(2 * far * near) / (far - near), 1
		);

		return instance;
	}

	/**
	 * Sets the matrix to be a look-at view transform.
	 */
	setLookAt(eye: Vector3, center: Vector3, up: Vector3) {
		let f = center.subtractVector(eye).normalize();
		let s = f.crossVector(up).normalize();
		let u = s.crossVector(f).normalize();

		this.set(
			s.x, s.y, s.y, 0,
			u.x, u.y, u.y, 0,
			-f.x, -f.y, -f.y, 0,
			-s.dotVector(eye), -u.dotVector(eye), f.dotVector(eye), 1
		);

		return this;
	}

	/**
	 * Creates a new look-at view transform.
	 */
	static newLookAt(eye: Vector3, center: Vector3, up: Vector3) {
		let instance = new Matrix4x4();

		instance.setLookAt(eye, center, up);

		return instance;
	}

	/**
	 * Inverts the transformation.
	 * @param out The Matrix to output to. Defaults to self.
	 */
	invert(out: Matrix4x4 = this) {
		let a = this.array;
		let a11 = a[0], a12 = a[1], a13 = a[2], a14 = a[3],
			a21 = a[4], a22 = a[5], a23 = a[6], a24 = a[7],
			a31 = a[8], a32 = a[9], a33 = a[10],a34 = a[11],
			a41 = a[12],a42 = a[13],a43 = a[14],a44 = a[15];

		let det = this.determinant();

		if (det == 0) {
			return this.copy(out);
		}

		let b11 = (a22*a33*a44 + a23*a34*a42 + a24*a32*a43 - a22*a34*a43 - a23*a32*a44 - a24*a33*a42) / det;
		let b12 = (a12*a34*a43 + a13*a32*a44 + a14*a33*a42 - a12*a33*a44 - a13*a34*a42 - a14*a32*a43) / det;
		let b13 = (a12*a23*a44 + a13*a24*a42 + a14*a22*a43 - a12*a24*a43 - a13*a22*a44 - a14*a23*a42) / det;
		let b14 = (a12*a24*a33 + a13*a22*a34 + a14*a23*a32 - a12*a23*a34 - a13*a24*a32 - a14*a22*a33) / det;

		let b21 = (a21*a34*a43 + a23*a31*a44 + a24*a33*a41 - a21*a33*a44 - a23*a34*a41 - a24*a31*a43) / det;
		let b22 = (a11*a33*a44 + a13*a34*a41 + a14*a31*a43 - a11*a34*a43 - a13*a31*a44 - a14*a33*a41) / det;
		let b23 = (a11*a24*a43 + a13*a21*a44 + a14*a23*a41 - a11*a23*a44 - a13*a24*a41 - a14*a21*a43) / det;
		let b24 = (a11*a23*a34 + a13*a24*a31 + a14*a21*a33 - a11*a24*a33 - a13*a21*a34 - a14*a23*a31) / det;

		let b31 = (a21*a32*a44 + a22*a34*a41 + a24*a31*a42 - a21*a34*a42 - a22*a31*a44 - a24*a32*a41) / det;
		let b32 = (a11*a34*a42 + a12*a31*a44 + a14*a32*a41 - a11*a32*a44 - a12*a34*a41 - a14*a31*a42) / det;
		let b33 = (a11*a22*a44 + a12*a24*a41 + a14*a21*a42 - a11*a24*a42 - a12*a21*a44 - a14*a22*a41) / det;
		let b34 = (a11*a24*a32 + a12*a21*a34 + a14*a22*a31 - a11*a22*a34 - a12*a24*a31 - a14*a21*a32) / det;

		let b41 = (a21*a33*a42 + a22*a31*a43 + a23*a32*a41 - a21*a32*a43 - a22*a33*a41 - a23*a31*a42) / det;
		let b42 = (a11*a32*a43 + a12*a33*a41 + a13*a31*a42 - a11*a33*a42 - a12*a31*a43 - a13*a32*a41) / det;
		let b43 = (a11*a23*a42 + a12*a21*a43 + a13*a22*a41 - a11*a22*a43 - a12*a23*a41 - a13*a21*a42) / det;
		let b44 = (a11*a22*a33 + a12*a23*a31 + a13*a21*a32 - a11*a23*a32 - a12*a21*a33 - a13*a22*a31) / det;

		out.set(
			b11, b12, b13, b14,
			b21, b22, b23, b24,
			b31, b32, b33, b34,
			b41, b42, b43, b44
		);

		return out;
	}

	/**
	 * Returns the matrix's determinant.
	 */
	determinant(): number {
		let a = this.array;

		let a11 = a[0], a12 = a[1], a13 = a[2], a14 = a[3],
			a21 = a[4], a22 = a[5], a23 = a[6], a24 = a[7],
			a31 = a[8], a32 = a[9], a33 = a[10],a34 = a[11],
			a41 = a[12],a42 = a[13],a43 = a[14],a44 = a[15];

		return a11*a22*a33*a44 + a11*a23*a34*a42 + a11*a24*a32*a43
			+ a12*a21*a34*a43 + a12*a23*a31*a44 + a12*a24*a33*a41
			+ a13*a21*a32*a44 + a13*a22*a34*a41 + a13*a24*a31*a42
			+ a14*a21*a33*a42 + a14*a22*a31*a43 + a14*a23*a32*a41
			- a11*a22*a34*a43 - a11*a23*a32*a44 - a11*a24*a33*a42
			- a12*a21*a33*a44 - a12*a23*a34*a41 - a12*a24*a31*a43
			- a13*a21*a34*a42 - a13*a22*a31*a44 - a13*a24*a32*a41
			- a14*a21*a32*a43 - a14*a22*a33*a41 - a14*a23*a31*a42;
	}

	/**
	 * Resets the matrix to be a translation.
	 */
	setTranslation(x, y, z) {
		this.set(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			x, y, z, 1
		);

		return this;
	}

	/**
	 * Translates the matrix.
	 * @param out The Matrix to output to. Defaults to self.
	 */
	translate(x, y, z, out: Matrix4x4 = this) {
		this.multiply(
			1, 0, 0, 0,
			0, 1, 0, 0,
			0, 0, 1, 0,
			x, y, z, 1,
			out
		);

		return out;
	}

	/**
	 * Resets the matrix to be a scale.
	 */
	setScale(x, y, z) {
		this.set(
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1
		);

		return this;
	}

	/**
	 * Scales the matrix.
	 * @param out The Matrix to output to. Default to self.
	 */
	scale(x, y, z, out: Matrix4x4 = this) {
		this.multiply(
			x, 0, 0, 0,
			0, y, 0, 0,
			0, 0, z, 0,
			0, 0, 0, 1,
			out
		);

		return this;
	}

	/**
	 * Rotates the matrix with Euler angles.
	 * @param out The Matrix to output to. Defaults to self.
	 */
	rotateEuler(x, y, z, out: Matrix4x4 = this) {
		this.rotateX(x, out)
		    .rotateY(y, out)
		    .rotateZ(z, out);

		return out;
	}

	/**
	 * Rotates the matrix around the X axis.
	 * @param out The Matrix to output to. Defaults to self.
	 */
	rotateX(t, out: Matrix4x4 = this) {
		this.multiply(
			1, 0, 0, 0,
			0, Math.cos(t), -Math.sin(t), 0,
			0, Math.sin(t), Math.cos(t), 0,
			0, 0, 0, 1,
			out
		);

		return out;
	}

	/**
	 * Rotates the matrix around the X axis.
	 * @param out The Matrix to output to. Defaults to self.
	 */
	rotateY(t, out: Matrix4x4 = this) {
		this.multiply(
			Math.cos(t), 0, Math.sin(t), 0,
			0, 1, 0, 0,
			-Math.sin(t), 0, Math.cos(t), 0,
			0, 0, 0, 1,
			out
		);

		return out;
	}

	/**
	 * Rotates the matrix around the X axis.
	 * @param out The Matrix to output to. Defaults to self.
	 */
	rotateZ(t, out: Matrix4x4 = this) {
		this.multiply(
			Math.cos(t), -Math.sin(t), 0, 0,
			Math.sin(t), Math.cos(t), 0, 0,
			0, 0, 1, 0,
			0, 0, 0, 1,
			out
		);

		return out;
	}

	/**
	 * Multiplies two matrices.
	 * @param out The Matrix to output to. Defaults to self.
	 */
	multiplyMatrix(other: Matrix4x4, out: Matrix4x4 = this) {
		let b = other.array;

		return this.multiply(
			b[0], b[1], b[2], b[3],
			b[4], b[5], b[6], b[7],
			b[8], b[9], b[10], b[11],
			b[12], b[13], b[14], b[15],
			out
		);
	}

	/**
	 * Multiplies the matrix with a loose matrix.
	 * @param out The Matrix to output to. Defaults to self.
	 */
	multiply(
		b11, b12, b13, b14,
		b21, b22, b23, b24,
		b31, b32, b33, b34,
		b41, b42, b43, b44, out: Matrix4x4 = this) {

		let a = this.array;
		let a11 = a[0], a12 = a[1], a13 = a[2], a14 = a[3],
			a21 = a[4], a22 = a[5], a23 = a[6], a24 = a[7],
			a31 = a[8], a32 = a[9], a33 = a[10],a34 = a[11],
			a41 = a[12],a42 = a[13],a43 = a[14],a44 = a[15];

		let c = out.array;

		c[0] = a11*b11 + a12*b21 + a13*b31 + a14*b41;
		c[1] = a11*b12 + a12*b22 + a13*b32 + a14*b42;
		c[2] = a11*b13 + a12*b23 + a13*b33 + a14*b43;
		c[3] = a11*b14 + a12*b24 + a13*b34 + a14*b44;

		c[4] = a21*b11 + a22*b21 + a23*b31 + a24*b41;
		c[5] = a21*b12 + a22*b22 + a23*b32 + a24*b42;
		c[6] = a21*b13 + a22*b23 + a23*b33 + a24*b43;
		c[7] = a21*b14 + a22*b24 + a23*b34 + a24*b44;

		c[8] =  a31*b11 + a32*b21 + a33*b31 + a34*b41;
		c[9] =  a31*b12 + a32*b22 + a33*b32 + a34*b42;
		c[10] = a31*b13 + a32*b23 + a33*b33 + a34*b43;
		c[11] = a31*b14 + a32*b24 + a33*b34 + a34*b44;

		c[12] = a41*b11 + a42*b21 + a43*b31 + a44*b41;
		c[13] = a41*b12 + a42*b22 + a43*b32 + a44*b42;
		c[14] = a41*b13 + a42*b23 + a43*b33 + a44*b43;
		c[15] = a41*b14 + a42*b24 + a43*b34 + a44*b44;

		return out;
	}
}