module solver {
	export interface Turn {
		x: number
		rot: number
	}

	export interface Solver {
		setTetris(t: model.Tetris)
		makeTurn(): Turn
	}

	interface CoefPart {
		field: number[][]
		figure: number[][]
	}

	function coefPartCreate(field: number[][]): CoefPart {
		function matrix(h: number, w: number): number[][] {
			var m: number[][]
			m = []
			for (var i = 0; i < h; ++i) {
				m[i] = []
				for (var j = 0; j < w; ++j) {
					m[i][j] = (Math.random() - 0.5) * 0.1 + ((h - i) / h)
				}
			}
			return m
		}
		return {
			field: matrix(field.length, field[0].length),
			figure: matrix(4, 4)
		}
	}

	function coefPartCalc(c: number[][], field: number[][]): number {
		var s: number
		s = 0
		for (var i = 0; i < field.length; ++i) {
			for (var j = 0; j < field[i].length; ++j) {
				if (field[i][j] != 0) {
					s += c[i][j]
				}
			}
		}
		return s
	}

	export class KohonenNet implements Solver {
		tetris: model.Tetris
		coef: CoefPart[]

		setTetris(t: model.Tetris) {
			this.tetris = t
			if (this.coef == null) {
				this.coef = []
				for (var i = 0; i < (t.field[0].length - 1) * 4; ++i) {
					this.coef[i] = coefPartCreate(t.field)
				}
			}
		}

		makeTurn(): Turn {
			var sum, max, iMax	: number
			max = -1E200
			for (var i = 0; i < this.coef.length; ++i) {
				sum =
					coefPartCalc(this.coef[i].field, this.tetris.field) +
					coefPartCalc(this.coef[i].figure, this.tetris.figure.f[0].figure)
				if (sum > max) {
					max = sum
					iMax = i
				}
			}
			return {
				x: Math.floor(iMax / 4),
				rot: iMax % 4 % this.tetris.figure.f.length
			}
		}
	}

	export function createKohonenSolver(): KohonenNet {
		return new KohonenNet()
	}

	export function cloneWithMutation(kn: KohonenNet, pItem: number, pRange:number): KohonenNet {
		function matrix(coef: number[][]): number[][] {
			var m: number[][]
			m = []
			for (var i = 0; i < coef.length; ++i) {
				m[i] = []
				for (var j = 0; j < coef[i].length; ++j) {
					if (Math.random() < pItem) {
						m[i][j] = coef[i][j] + Math.random() * pRange - pRange * 0.5
					} else {
						m[i][j] = coef[i][j]
					}
				}
			}
			return m
		}
		function clone(): KohonenNet {
			var k: KohonenNet
			k = new KohonenNet()
			k.coef = []
			for (var i = 0; i < kn.coef.length; ++i) {
				k.coef[i] = {
					field: matrix(kn.coef[i].field),
					figure: matrix(kn.coef[i].figure)
				}
			}
			return k
		}
		return clone()
	}
}
