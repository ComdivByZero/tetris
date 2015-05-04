module draw {

	const SQUARE_SIZE = 25

	var canvas: HTMLCanvasElement
	var g: CanvasRenderingContext2D

	export function init(tetris: model.Tetris) {
		canvas = <HTMLCanvasElement>document.getElementById('canvas')
		g = <CanvasRenderingContext2D>canvas.getContext('2d')
	}

	export function figure(fig: number[][], x: number, y: number) {
		g.fillStyle = "#02C002"
		for (var i = 0; i < fig.length; ++i) {
			for (var j = 0; j < fig[i].length; ++j) {
				if (fig[i][j] != 0) {
					g.fillRect(
						(x + j) * SQUARE_SIZE + 1,
						(y + i) * SQUARE_SIZE + 1,
						SQUARE_SIZE - 2, SQUARE_SIZE - 2)
				}
			}
		}
	}

	export function field(field: number[][]) {
		figure(field, 0, 0)
	}

	export function background(field: number[][]) {
		g.fillStyle = "#012001"
		g.fillRect(0, 0, field[0].length * SQUARE_SIZE, field.length * SQUARE_SIZE)
	}

	export function tetris(tetris: model.Tetris) {
		var f: model.Figure

		background(tetris.field)
		field(tetris.field)
		f = tetris.figure
		figure(f.f[f.rot].figure, f.x, f.y)
	}
}
