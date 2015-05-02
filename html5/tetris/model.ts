module model {

    export interface FigureField {
        figure: number[][]
        dx : number
        dy : number
    }

    export interface Figure {
        x : number
        y : number
        f : FigureField[]
        rot: number
    }

    export interface Tetris {
        field : number[][]
        figure: Figure
    }

    const FIGURES : FigureField[][] = [
    	[	{	figure : [
    				[1],
    				[1],
    				[1],
    				[1]
    			], dx : 1, dy : 0
    		},
    		{	figure : [
    				[1, 1, 1, 1]
    			], dx : 0, dy : 1
    		}
    	],
    	[	{	figure : [
    				[1],
    				[1, 1, 1]
    			], dx : 0, dy : 1
    		},
    		{	figure : [
    				[1, 1],
    				[1],
    				[1]
    			], dx : 1, dy : 0
    		},
    		{	figure : [
    				[1, 1, 1],
    				[0, 0, 1]
    			], dx : 0, dy : 1
    		},
    		{	figure : [
    				[0, 1],
    				[0, 1],
    				[1, 1]
    			], dx : 0, dy : 0
    		}
    	],
    	[	{	figure : [
    				[0, 0, 1],
    				[1, 1, 1]
    			], dx : 0, dy : 1
    		},
    		{	figure : [
    				[1],
    				[1],
    				[1, 1]
    			], dx : 1, dy : 0
    		},
    		{	figure : [
    				[1, 1, 1],
    				[1]
    			], dx : 0, dy : 1
    		},
    		{	figure : [
    				[1, 1],
    				[0, 1],
    				[0, 1]
    			], dx : 1, dy : 0
    		}
    	],
    	[	{	figure : [
    				[1, 1],
    				[1, 1]
    			], dx : 1, dy : 1
    		}
    	],
    	[	{	figure : [
    				[0, 1],
    				[1, 1, 1]
    			],
    			dx : 0, dy : 1
    		},
    		{	figure : [
    				[1],
    				[1, 1],
    				[1]
    			],
    			dx : 1, dy : 0
    		},
    		{	figure : [
    				[1, 1, 1],
    				[0, 1]
    			], dx : 0, dy : 1
    		},
    		{	figure : [
    				[0, 1],
    				[1, 1],
    				[0, 1]
    			], dx : 1, dy : 0
    		}
    	],
    	[	{	figure : [
    				[0, 1],
    				[1, 1],
    				[1]
    			], dx : 1, dy : 0
    		},
    		{	figure : [
    				[1, 1],
    				[0, 1, 1]
    			], dx : 0, dy : 0
    		}
    	],
    	[	{	figure : [
    				[1],
    				[1, 1],
    				[0, 1]
    			], dx : 1, dy : 0
    		},
    		{	figure : [
    				[0, 1, 1],
    				[1, 1]
    			], dx : 0, dy : 0
    		}
    	]
    ]

    function assert(condition: boolean) {
        if (!condition) {
            throw "Assertion failed! See stack trace for details";
        }
    }

    function emptyLine(width: number) {
    	var l : number[]
        l = []
    	for (var i = 0; i < width; ++i) {
    		l[i] = 0
        }
    	return l
    }

    export function create(width: number, height: number) {
        var t : Tetris
        var y : number
        assert(width > 3 && height > 3)
        t = {
            field: [],
            figure: null
        }
    	for (y = 0; y < height; ++y) {
    		t.field[y] = emptyLine(width)
    	}
    	return t
    }

    export function createClassic() {
    	return create(10, 20)
    }

    export function isFigureCollideField(field : number[][], figure: number[][], fx : number, fy: number) {
        function isCollide(t : number[], y : number) {
    		var x: number

    		x = 0
    		while (x < t.length
    				&& (
    					(t[x] == 0)
    					|| (
    						x + fx >= 0 && x + fx < field[1].length
    						&&
    						y + fy >= 0 && y + fy < field.length
    						&&
    						field[fy + y][fx + x] == 0
    					)
    				)
                )
    		{
    			++x
    		}
    		return x < t.length
    	}
    	var y: number
    	y = 0
    	while (y < figure.length && !isCollide(figure[y], y)) {
    		++y
    	}
    	return y < figure.length
    }

    export function addFigure(tetris: Tetris, index: number, rotate: number) {
    	var f: FigureField[]

        f = FIGURES[index]

        assert(f != null)
    	tetris.figure = {
    		x : tetris.field[0].length / 2 - 2 + f[rotate].dx,
    		y : 0,
    		f : f,
    		rot : rotate
    	}
    	return !isFigureCollideField(tetris.field, f[rotate].figure, tetris.figure.x, tetris.figure.y)
    }

    export function addFigureRandom(tetris: Tetris) {
    	var r: number

        r = Math.floor(Math.random() * FIGURES.length)
    	return addFigure(tetris, r, Math.floor(Math.random() * FIGURES[r].length))
    }


    export function setFigurePositionInFieldIfAble(field: number[][], fig: Figure, rot: number, dx: number, dy: number) {
    	var able: boolean

        dx = dx + (fig.f[rot].dx - fig.f[fig.rot].dx)
    	dy = dy + (fig.f[rot].dy - fig.f[fig.rot].dy)
    	able = !isFigureCollideField(field, fig.f[rot].figure, fig.x + dx, fig.y + dy)
    	if (able) {
    		fig.x = fig.x + dx
    		fig.y = fig.y + dy
    		fig.rot = rot
    	}
    	return able
    }

    export function tryToMoveCurrentFigure(tetris: Tetris, dx : number, dy : number) {
    	return setFigurePositionInFieldIfAble(tetris.field, tetris.figure, tetris.figure.rot, dx, dy)
    }

    export function tryToRotateCurrentFigure(tetris: Tetris) {
    	var rot: number

    	rot = (tetris.figure.rot + 1) % tetris.figure.f.length
    	return setFigurePositionInFieldIfAble(tetris.field, tetris.figure, rot, 0, 0)
    }


    export function embedFigureIntoField(field : number[][], fig: Figure) {
    	var x, y: number,
            f: number[][]

    	f = fig.f[fig.rot].figure
    	for (var i = 0; i < f.length; ++i) {
    		y = fig.y + i
    		if (y >= 0 && y < field.length) {
    			for (var j = 0; j < f[i].length; ++j) {
    				x = fig.x + j
    				if (x >= 0 && x < field[y].length && field[y][x] == 0) {
    					field[y][x] = f[i][j]
    				}
    			}
    		}
    	}
    }

    export function embedCurrentFigureIntoField(tetris: Tetris) {
    	embedFigureIntoField(tetris.field, tetris.figure)
    	tetris.figure = null
    }

    export function searchCompletedLines(field: number[][]) {
        function fullLine(f: number[]) {
    		var i: number
    		i = 0
    		while (i < f.length && f[i] != 0) {
    			++i
    		}
    		return i >= f.length
    	}
    	var lines:number[], j: number

    	lines = []
    	j = 0
    	for (var i = 0; i < field.length; ++i) {
    		if (fullLine(field[i])) {
    			lines[j] = i
    			++j
    		}
    	}
    	return lines
    }

    export function removeCompletedLines(tetris: Tetris) {
    	var lines: number[]

    	lines = searchCompletedLines(tetris.field)
    	for (var i = 0; i < lines.length; ++i) {
    		tetris.field.splice(lines[i], 1)
    		tetris.field.splice(0, 0, emptyLine(tetris.field[0].length))
    	}
    }

}
