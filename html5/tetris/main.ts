module main {


	const
		GS_PLAY = 0,
		GS_PAUSE = 1,
		GS_END = 2,

		KC_N = 78,
		KC_P = 80,
		KC_W = 87,
		KC_S = 83,
		KC_A = 65,
		KC_D = 68,
		KC_ArrowUp = 38,
		KC_ArrowDown = 40,
		KC_ArrowLeft = 37,
		KC_ArrowRight = 39

	interface Game {
		state: number
		step: number
		dstep: number
		tstep: number
		multstep: number
		pressedLeft: number
		pressedRight: number
		pressedStep: number
		pressedTStep: number
		prevTime: number
		score: number
		tetris: model.Tetris
	}

	var game: Game

	function keyCodeDown(key: number) {
		if (key == KC_N) {
			load()
		} else if (game.state == GS_END) {

		} else if (game.state == GS_PAUSE) {
			game.state = GS_PLAY
		} else if (key == KC_ArrowUp || key == KC_W) {
			model.tryToRotateCurrentFigure(game.tetris)
		} else if (key == KC_ArrowDown || key == KC_S) {
			game.multstep = 16
		} else if (key == KC_ArrowLeft || key == KC_A) {
			model.tryToMoveCurrentFigure(game.tetris, -1, 0)
			game.pressedLeft = -1
			game.pressedTStep = game.pressedStep * 3
		} else if (key == KC_ArrowRight || key == KC_D) {
			model.tryToMoveCurrentFigure(game.tetris, 1, 0)
			game.pressedRight = 1
			game.pressedTStep = game.pressedStep * 3
		} else if (key == KC_P) {
			game.state = GS_PAUSE
		}
	}

	function keydown(ke: KeyboardEvent) {
		if (!ke.repeat) {
			keyCodeDown(ke.keyCode)
		}
	}

	function keyCodeUp(key: number) {
		if (key == KC_ArrowDown || key == KC_S) {
			game.multstep = 1
		} else if (key == KC_ArrowLeft || key == KC_A) {
			game.pressedLeft = 0
		} else if (key == KC_ArrowRight || key == KC_D) {
			game.pressedRight = 0
		}
	}

	function keyup(ke: KeyboardEvent) {
		keyCodeUp(ke.keyCode)
	}

	function lostFocus(e: FocusEvent) {
		if (game.state != GS_END) {
			game.state = GS_PAUSE
		}
	}

	function setKey(id: string, keyCode: number) {
		var l = document.getElementById(id)
		l.ontouchstart = function(te: TouchEvent) {
			keyCodeDown(keyCode)
			l.onmousedown = null
		}
		l.onmousedown = function(me: MouseEvent) {
			keyCodeDown(keyCode)
		}
		l.ontouchend = function(te: TouchEvent) {
			keyCodeUp(keyCode)
			l.onmouseup = null
		}
		l.onmouseup = function(me: MouseEvent) {
			keyCodeUp(keyCode)
		}
	}

	function load() {
		game = {
			state : GS_PLAY,
			step : 1.0,
			dstep : 0.001,
			tstep : 0.3,
			multstep : 1,
			pressedLeft : 0,
			pressedRight : 0,
			pressedStep : 0.1,
			pressedTStep : 0.1 * 2,
			prevTime: -1,
			score: 0,
			tetris : model.createClassic()
		}
		draw.init(game.tetris)
		model.addFigureRandom(game.tetris)

		window.onkeydown = keydown
		window.onkeyup = keyup
		window.onblur = lostFocus

		setKey('left', KC_ArrowLeft)
		setKey('right', KC_ArrowRight)
		setKey('up', KC_ArrowUp)
		setKey('down', KC_ArrowDown)
		setKey('pause', KC_P)
		setKey('new', KC_N)
	}

	function update(time: number) {
		var dt, dx: number

		if (game.prevTime >= 0) {
			dt = (time - game.prevTime) / 1000

			if (game.state == GS_PLAY) {
				game.tstep = game.tstep - dt * game.multstep
				game.step = game.step - dt * game.dstep
				if (game.tstep <= 0) {
					if (!model.tryToMoveCurrentFigure(game.tetris, 0, 1)) {
						game.multstep = 1
						game.pressedLeft = 0
						game.pressedRight = 0
						model.embedCurrentFigureIntoField(game.tetris)
						game.score += ((1 << model.removeCompletedLines(game.tetris)) - 1) * 100
						document.getElementById('score').textContent = '' + game.score

						if (!model.addFigureRandom(game.tetris)) {
							game.state = GS_END
						}
					}
					game.tstep = game.step
				}
				dx = game.pressedLeft + game.pressedRight
				if (dx != 0) {
					game.pressedTStep = game.pressedTStep - dt
					if (game.pressedTStep < 0) {
						model.tryToMoveCurrentFigure(game.tetris, dx, 0)
						game.pressedTStep = game.pressedStep
					}
				}
			}
		}
		game.prevTime = time

		draw.tetris(game.tetris)

		requestAnimationFrame(update)
	}

	export function main() {
		load()
		requestAnimationFrame(update)
	}
}

main.main()
