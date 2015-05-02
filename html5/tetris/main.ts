module main {

    enum GameState {
        PLAY,
    	PAUSE,
    	END
    }

    enum KeyCode {
        N = 78,
        P = 80,
        ArrowUp = 38,
        ArrowDown = 40,
        ArrowLeft = 37,
        ArrowRight = 39
    }

    interface Game {
        state: GameState
        step: number
        dstep: number
        tstep: number
        multstep: number
        pressedLeft: number
        pressedRight: number
        pressedStep: number
        pressedTStep: number
        prevTime: number
        tetris: model.Tetris
    }

    var game: Game

    function keydown(ke: KeyboardEvent) {
        var key: number

        if (!ke.repeat) {
            key = ke.keyCode
            if (key == KeyCode.N) {
                load()
            } else if (game.state == GameState.END) {

            } else if (game.state == GameState.PAUSE) {
                game.state = GameState.PLAY
            } else if (key == KeyCode.ArrowUp) {
                model.tryToRotateCurrentFigure(game.tetris)
            } else if (key == KeyCode.ArrowDown) {
                game.multstep = 8
            } else if (key == KeyCode.ArrowLeft) {
                model.tryToMoveCurrentFigure(game.tetris, -1, 0)
                game.pressedLeft = -1
                game.pressedTStep = game.pressedStep * 3
            } else if (key == KeyCode.ArrowRight) {
                model.tryToMoveCurrentFigure(game.tetris, 1, 0)
                game.pressedRight = 1
                game.pressedTStep = game.pressedStep * 3
            } else if (key == KeyCode.P) {
                game.state = GameState.PAUSE
            }
        }
    }

    function keyup(ke: KeyboardEvent) {
        var key: number

        key = ke.keyCode
        if (key == KeyCode.ArrowDown) {
            game.multstep = 1
        } else if (key == KeyCode.ArrowLeft) {
            game.pressedLeft = 0
        } else if (key == KeyCode.ArrowRight) {
            game.pressedRight = 0
        }
    }

    function lostFocus(e: FocusEvent) {
        if (game.state != GameState.END) {
            game.state = GameState.PAUSE
        }
    }

    function load() {
        game = {
            state : GameState.PLAY,
            step : 0.3,
            dstep : 0.001,
            tstep : 0.3,
            multstep : 1,
            pressedLeft : 0,
            pressedRight : 0,
            pressedStep : 0.1,
            pressedTStep : 0.1 * 2,
            prevTime: -1,
            tetris : model.createClassic()
        }
        draw.init(game.tetris)
        model.addFigureRandom(game.tetris)

        window.onkeydown = keydown
        window.onkeyup = keyup
        window.onblur = lostFocus
    }

    function update(time: number) {
        var dt, dx: number

        if (game.prevTime >= 0) {
            dt = (time - game.prevTime) / 1000

            if (game.state == GameState.PLAY) {
                game.tstep = game.tstep - dt * game.multstep
                game.step = game.step - dt * game.dstep
                if (game.tstep <= 0) {
                    if (!model.tryToMoveCurrentFigure(game.tetris, 0, 1)) {
                        game.multstep = 1
                        game.pressedLeft = 0
                        game.pressedRight = 0
                        model.embedCurrentFigureIntoField(game.tetris)
                        model.removeCompletedLines(game.tetris)
                        if (!model.addFigureRandom(game.tetris)) {
                            game.state = GameState.END
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
