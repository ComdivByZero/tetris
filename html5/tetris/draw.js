var draw;
(function (draw) {
    var SQUARE_SIZE = 25;
    var canvas;
    var g;
    function init(tetris) {
        canvas = document.getElementById('canvas');
        g = canvas.getContext('2d');
    }
    draw.init = init;
    function figure(fig, x, y) {
        g.fillStyle = "#02C002";
        for (var i = 0; i < fig.length; ++i) {
            for (var j = 0; j < fig[i].length; ++j) {
                if (fig[i][j] != 0) {
                    g.fillRect((x + j) * SQUARE_SIZE + 1, (y + i) * SQUARE_SIZE + 1, SQUARE_SIZE - 2, SQUARE_SIZE - 2);
                }
            }
        }
    }
    draw.figure = figure;
    function field(field) {
        figure(field, 0, 0);
    }
    draw.field = field;
    function background(field) {
        g.fillStyle = "#012001";
        g.fillRect(0, 0, field[0].length * SQUARE_SIZE, field.length * SQUARE_SIZE);
    }
    draw.background = background;
    function tetris(tetris) {
        var f;
        background(tetris.field);
        field(tetris.field);
        f = tetris.figure;
        figure(f.f[f.rot].figure, f.x, f.y);
    }
    draw.tetris = tetris;
})(draw || (draw = {}));
