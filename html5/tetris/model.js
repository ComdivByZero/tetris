var model;
(function (model) {
    var FIGURES = [
        [{ figure: [
                    [1],
                    [1],
                    [1],
                    [1]
                ], dx: 1, dy: 0
            },
            { figure: [
                    [1, 1, 1, 1]
                ], dx: 0, dy: 1
            }
        ],
        [{ figure: [
                    [1],
                    [1, 1, 1]
                ], dx: 0, dy: 1
            },
            { figure: [
                    [1, 1],
                    [1],
                    [1]
                ], dx: 1, dy: 0
            },
            { figure: [
                    [1, 1, 1],
                    [0, 0, 1]
                ], dx: 0, dy: 1
            },
            { figure: [
                    [0, 1],
                    [0, 1],
                    [1, 1]
                ], dx: 0, dy: 0
            }
        ],
        [{ figure: [
                    [0, 0, 1],
                    [1, 1, 1]
                ], dx: 0, dy: 1
            },
            { figure: [
                    [1],
                    [1],
                    [1, 1]
                ], dx: 1, dy: 0
            },
            { figure: [
                    [1, 1, 1],
                    [1]
                ], dx: 0, dy: 1
            },
            { figure: [
                    [1, 1],
                    [0, 1],
                    [0, 1]
                ], dx: 1, dy: 0
            }
        ],
        [{ figure: [
                    [1, 1],
                    [1, 1]
                ], dx: 1, dy: 1
            }
        ],
        [{ figure: [
                    [0, 1],
                    [1, 1, 1]
                ],
                dx: 0, dy: 1
            },
            { figure: [
                    [1],
                    [1, 1],
                    [1]
                ],
                dx: 1, dy: 0
            },
            { figure: [
                    [1, 1, 1],
                    [0, 1]
                ], dx: 0, dy: 1
            },
            { figure: [
                    [0, 1],
                    [1, 1],
                    [0, 1]
                ], dx: 1, dy: 0
            }
        ],
        [{ figure: [
                    [0, 1],
                    [1, 1],
                    [1]
                ], dx: 1, dy: 0
            },
            { figure: [
                    [1, 1],
                    [0, 1, 1]
                ], dx: 0, dy: 0
            }
        ],
        [{ figure: [
                    [1],
                    [1, 1],
                    [0, 1]
                ], dx: 1, dy: 0
            },
            { figure: [
                    [0, 1, 1],
                    [1, 1]
                ], dx: 0, dy: 0
            }
        ]
    ];
    function assert(condition) {
        if (!condition) {
            throw "Assertion failed! See stack trace for details";
        }
    }
    function emptyLine(width) {
        var l;
        l = [];
        for (var i = 0; i < width; ++i) {
            l[i] = 0;
        }
        return l;
    }
    function create(width, height) {
        var t;
        var y;
        assert(width > 3 && height > 3);
        t = {
            field: [],
            figure: null
        };
        for (y = 0; y < height; ++y) {
            t.field[y] = emptyLine(width);
        }
        return t;
    }
    model.create = create;
    function createClassic() {
        return create(10, 20);
    }
    model.createClassic = createClassic;
    function isFigureCollideField(field, figure, fx, fy) {
        function isCollide(t, y) {
            var x;
            x = 0;
            while (x < t.length
                && ((t[x] == 0)
                    || (x + fx >= 0 && x + fx < field[1].length
                        &&
                            y + fy >= 0 && y + fy < field.length
                        &&
                            field[fy + y][fx + x] == 0))) {
                ++x;
            }
            return x < t.length;
        }
        var y;
        y = 0;
        while (y < figure.length && !isCollide(figure[y], y)) {
            ++y;
        }
        return y < figure.length;
    }
    model.isFigureCollideField = isFigureCollideField;
    function addFigure(tetris, index, rotate) {
        var f;
        f = FIGURES[index];
        assert(f != null);
        tetris.figure = {
            x: tetris.field[0].length / 2 - 2 + f[rotate].dx,
            y: 0,
            f: f,
            rot: rotate
        };
        return !isFigureCollideField(tetris.field, f[rotate].figure, tetris.figure.x, tetris.figure.y);
    }
    model.addFigure = addFigure;
    function addFigureRandom(tetris) {
        var r;
        r = Math.floor(Math.random() * FIGURES.length);
        return addFigure(tetris, r, Math.floor(Math.random() * FIGURES[r].length));
    }
    model.addFigureRandom = addFigureRandom;
    function setFigurePositionInFieldIfAble(field, fig, rot, dx, dy) {
        var able;
        dx = dx + (fig.f[rot].dx - fig.f[fig.rot].dx);
        dy = dy + (fig.f[rot].dy - fig.f[fig.rot].dy);
        able = !isFigureCollideField(field, fig.f[rot].figure, fig.x + dx, fig.y + dy);
        if (able) {
            fig.x = fig.x + dx;
            fig.y = fig.y + dy;
            fig.rot = rot;
        }
        return able;
    }
    model.setFigurePositionInFieldIfAble = setFigurePositionInFieldIfAble;
    function tryToMoveCurrentFigure(tetris, dx, dy) {
        return setFigurePositionInFieldIfAble(tetris.field, tetris.figure, tetris.figure.rot, dx, dy);
    }
    model.tryToMoveCurrentFigure = tryToMoveCurrentFigure;
    function tryToRotateCurrentFigure(tetris) {
        var rot;
        rot = (tetris.figure.rot + 1) % tetris.figure.f.length;
        return setFigurePositionInFieldIfAble(tetris.field, tetris.figure, rot, 0, 0);
    }
    model.tryToRotateCurrentFigure = tryToRotateCurrentFigure;
    function embedFigureIntoField(field, fig) {
        var x, y, f;
        f = fig.f[fig.rot].figure;
        for (var i = 0; i < f.length; ++i) {
            y = fig.y + i;
            if (y >= 0 && y < field.length) {
                for (var j = 0; j < f[i].length; ++j) {
                    x = fig.x + j;
                    if (x >= 0 && x < field[y].length && field[y][x] == 0) {
                        field[y][x] = f[i][j];
                    }
                }
            }
        }
    }
    model.embedFigureIntoField = embedFigureIntoField;
    function embedCurrentFigureIntoField(tetris) {
        embedFigureIntoField(tetris.field, tetris.figure);
        tetris.figure = null;
    }
    model.embedCurrentFigureIntoField = embedCurrentFigureIntoField;
    function searchCompletedLines(field) {
        function fullLine(f) {
            var i;
            i = 0;
            while (i < f.length && f[i] != 0) {
                ++i;
            }
            return i >= f.length;
        }
        var lines, j;
        lines = [];
        j = 0;
        for (var i = 0; i < field.length; ++i) {
            if (fullLine(field[i])) {
                lines[j] = i;
                ++j;
            }
        }
        return lines;
    }
    model.searchCompletedLines = searchCompletedLines;
    function removeCompletedLines(tetris) {
        var lines;
        lines = searchCompletedLines(tetris.field);
        for (var i = 0; i < lines.length; ++i) {
            tetris.field.splice(lines[i], 1);
            tetris.field.splice(0, 0, emptyLine(tetris.field[0].length));
        }
    }
    model.removeCompletedLines = removeCompletedLines;
})(model || (model = {}));
