var autoplay;
(function (autoplay) {
    var iteration = 0;
    function putFigure(tetris, turn) {
        do {
            while ((turn.rot != tetris.figure.rot) && model.tryToRotateCurrentFigure(tetris)) {
                ;
            }
        } while ((turn.rot != tetris.figure.rot) && model.tryToMoveCurrentFigure(tetris, 0, 1));
        do {
            while ((turn.x < tetris.figure.x) && model.tryToMoveCurrentFigure(tetris, -1, 0)) {
                ;
            }
            while ((turn.x > tetris.figure.x) && model.tryToMoveCurrentFigure(tetris, 1, 0)) {
                ;
            }
        } while (model.tryToMoveCurrentFigure(tetris, 0, 1));
        model.embedCurrentFigureIntoField(tetris);
        return ((1 << model.removeCompletedLines(tetris)) - 1) * 20 + 1;
    }
    function match(games) {
        var activeGamesCount, rot, fig, step;
        activeGamesCount = games.length;
        for (var i = 0; i < games.length; ++i) {
            games[i].active = true;
            model.clean(games[i].t);
        }
        step = 0;
        do {
            fig = Math.floor(Math.random() * model.FIGURES.length);
            rot = Math.floor(Math.random() * model.FIGURES[fig].length);
            for (var i = 0; i < games.length; ++i) {
                if (!games[i].active) {
                    ;
                }
                else if (model.addFigure(games[i].t, fig, rot)) {
                    games[i].score += putFigure(games[i].t, games[i].s.makeTurn());
                }
                else {
                    games[i].active = false;
                    --activeGamesCount;
                }
            }
            ++step;
        } while (activeGamesCount > 0);
    }
    function series(games) {
        var jMax, solv, score, f;
        if (games[0].serie < 41) {
            match(games);
            ++games[0].serie;
        }
        else {
            games[0].serie = 0;
            for (var i = 0; i < 9; ++i) {
                jMax = i;
                for (var j = i + 1; j < games.length; ++j) {
                    if (games[jMax].score < games[j].score) {
                        jMax = j;
                    }
                }
                if (i == 0) {
                    console.log("" + iteration + ") " + games[jMax].score);
                    ++iteration;
                }
                solv = games[i].s;
                score = games[i].score;
                games[i].s = games[jMax].s;
                games[i].s.setTetris(games[i].t);
                games[i].active = true;
                model.clean(games[i].t);
                games[jMax].s = solv;
                games[jMax].score = score;
                games[i].score = 0;
            }
            for (var i = 9; i < games.length; ++i) {
                f = Math.floor(i / 9);
                games[i].s = solver.cloneWithMutation(games[f].s, 0.02 * (f + 1) * Math.random(), 0.02 * (f + 1) * Math.random());
                games[i].s.setTetris(games[i].t);
                games[i].score = 0;
                games[i].active = true;
                model.clean(games[i].t);
            }
        }
        return games[0].serie != 0;
    }
    autoplay.series = series;
    function createGames() {
        var g;
        g = [];
        for (var i = 0; i < 81; ++i) {
            g[i] = {
                t: model.createClassic(),
                s: solver.createKohonenSolver(),
                active: true,
                score: 0,
                serie: 0
            };
            g[i].s.setTetris(g[i].t);
        }
        return g;
    }
    autoplay.createGames = createGames;
})(autoplay || (autoplay = {}));
