var solver;
(function (solver) {
    function coefPartCreate(field) {
        function matrix(h, w) {
            var m;
            m = [];
            for (var i = 0; i < h; ++i) {
                m[i] = [];
                for (var j = 0; j < w; ++j) {
                    m[i][j] = (Math.random() - 0.5) * 0.1 + ((h - i) / h);
                }
            }
            return m;
        }
        return {
            field: matrix(field.length, field[0].length),
            figure: matrix(4, 4)
        };
    }
    function coefPartCalc(c, field) {
        var s;
        s = 0;
        for (var i = 0; i < field.length; ++i) {
            for (var j = 0; j < field[i].length; ++j) {
                if (field[i][j] != 0) {
                    s += c[i][j];
                }
            }
        }
        return s;
    }
    var KohonenNet = (function () {
        function KohonenNet() {
        }
        KohonenNet.prototype.setTetris = function (t) {
            this.tetris = t;
            if (this.coef == null) {
                this.coef = [];
                for (var i = 0; i < (t.field[0].length - 1) * 4; ++i) {
                    this.coef[i] = coefPartCreate(t.field);
                }
            }
        };
        KohonenNet.prototype.makeTurn = function () {
            var sum, max, iMax;
            max = -1E200;
            for (var i = 0; i < this.coef.length; ++i) {
                sum =
                    coefPartCalc(this.coef[i].field, this.tetris.field) +
                        coefPartCalc(this.coef[i].figure, this.tetris.figure.f[0].figure);
                if (sum > max) {
                    max = sum;
                    iMax = i;
                }
            }
            return {
                x: Math.floor(iMax / 4),
                rot: iMax % 4 % this.tetris.figure.f.length
            };
        };
        return KohonenNet;
    })();
    solver.KohonenNet = KohonenNet;
    function createKohonenSolver() {
        return new KohonenNet();
    }
    solver.createKohonenSolver = createKohonenSolver;
    function cloneWithMutation(kn, pItem, pRange) {
        function matrix(coef) {
            var m;
            m = [];
            for (var i = 0; i < coef.length; ++i) {
                m[i] = [];
                for (var j = 0; j < coef[i].length; ++j) {
                    if (Math.random() < pItem) {
                        m[i][j] = coef[i][j] + Math.random() * pRange - pRange * 0.5;
                    }
                    else {
                        m[i][j] = coef[i][j];
                    }
                }
            }
            return m;
        }
        function clone() {
            var k;
            k = new KohonenNet();
            k.coef = [];
            for (var i = 0; i < kn.coef.length; ++i) {
                k.coef[i] = {
                    field: matrix(kn.coef[i].field),
                    figure: matrix(kn.coef[i].figure)
                };
            }
            return k;
        }
        return clone();
    }
    solver.cloneWithMutation = cloneWithMutation;
})(solver || (solver = {}));
