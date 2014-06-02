var taylor = taylor || {};

taylor.core = (function () {

    var graph,
        derivatives,
        derivativesOutput,
        radius,
        polynomial,
        taylorNumber,
        derivativesNumber = 1,
        _point = 0;

    function init() {
        derivativesOutput = new taylor.DerivativesValue();

        taylorNumber = new taylor.FunctionChoose().getFunctionNumber();

        taylor.derivativesLoader.load();
    }

    function setTaylorNumber(number) {
        taylorNumber = number;
        //setGraphTaylor(graph.getCircleX());
        derivativesOutput.resetDerivatives();
        graph.redraw();
    }

    function setPolynomial(arr) {
        polynomial = new taylor.polynomial(arr);
    }

    function setGraphTaylor(point) {
        graph.setTaylor(function (x) {
            return polynomial.func(x, point);
        });
    }

    function jsonGot() {

        derivatives = taylor.derivativesLoader.getDerivatives();
        radius = new taylor.Radius();

        setPolynomial(derivatives[taylorNumber][Math.round(derivatives[taylorNumber].length/2)].slice(0, derivativesNumber));

        graph = new taylor.SimpleGraph("chart1", {
            "xmax": 10, "xmin": -10,
            "ymax": 10, "ymin": -10,
            "title": "Simple Graph1",
            "xlabel": "X Axis",
            "ylabel": "Y Axis",
            "func": functionOnDesk,
            "tay": functionTaylor
        });
    }

    function registerModule(func) {
        func(taylor);
    }

    function getTaylorAt(point) {
        _point = parseInt(point);
        var arr = taylor.derivativesLoader.getTaylorAt(taylorNumber, point);
        setPolynomial(arr.slice(0, derivativesNumber));
        setGraphTaylor(point);

        setRadius(point);
        graph.redraw();
    }

    function setDerivativesNumber(number) {
        derivativesNumber = parseInt(number);
        getTaylorAt(_point);
    }

    function functionOnDesk(x) {
        return taylor.derivativesLoader.getFunction(taylorNumber)(x); //todo: у номер 3 есть разрыв. Надо не прорисовывать в нем путь.
    }

    function functionTaylor(x) {
        return polynomial.func(x, 0);
    }

    function setRadius(point) {
        var epsilon = 0.01,
            delta = 0.01;
        radius.setRadius(Math.abs(functionTaylor(point) - functionOnDesk(parseFloat(point))));

        function f(d) {
            return Math.abs(graph.getTaylorAt(parseFloat(point) + d) - functionOnDesk(parseFloat(point) + d));
        }

        while (f(delta) < epsilon && f(-delta) < epsilon) {
            delta += 0.01;
        }

        delta = Math.round(delta*100)/100;

        radius.setRadius(delta);
    }

    function getBounds() {
        var o = {
            left: Number.NEGATIVE_INFINITY,
            right: Number.POSITIVE_INFINITY
        };

        o.left = taylor.derivativesLoader.getLeft() || o.left;
        o.right = taylor.derivativesLoader.getRight() || o.right;

        return o;
    }

    return {
        init: init,

        jsonGot: jsonGot,

        registerModule: registerModule,

        getTaylorAt: getTaylorAt,

        setDerivativesNumber: setDerivativesNumber,

        setTaylorNumber: setTaylorNumber,

        getBounds: getBounds
    };
})();

taylor.utils = (function () {

    var extendDeep = function (parent, child) {
        var i,
            toStr = Object.prototype.toString,
            astr = "[object Array]";

        child = child || ((toStr.call(parent) === astr) ? [] : {});

        for (i in parent) {
            if (parent.hasOwnProperty(i)) {
                if (typeof parent[i] === "object") {
                    child[i] = (toStr.call(parent[i]) === astr) ? [] : {};
                    extendDeep(parent[i], child[i]);
                } else {
                    child[i] = parent[i];
                }
            }
        }
        return child;
    };

    var isEqual = function (one, two) {
        var i;

        for(i in one) {
            if(one.hasOwnProperty(i)) {
                if(one[i] != two[i]) {
                    return false;
                }
            }
        }

        return true;
    };

    var isAPartOf = function (array, object) {
        var i,
            arrayLength = array.length;

        for (i = 0; i < arrayLength; i += 1) {
            if(isEqual(array[i], object)) {
                return true;
            }
        }

        return false;
    };

    return {
        extendDeep: extendDeep,

        isEqual: isEqual,

        isAPartOf: isAPartOf
    }
})();

taylor.derivativesLoader = (function () {

    var derivatives = [],
        functions = [
        function (x) {
            return (1 + x + x*x)/(1 - x + x*x);
        },

        function (x) {
            return x/(x*x + x + 1);
        },

        function (x) {
            return (5*x*x)/(x*x + 2*x + 3);
        },

        function (x) {
            return (2*x*x*x - 4*x*x + x + 1)/(x*x + 3*x + 1);
        },

        function (x) {
            return Math.sin(x);
        },

        function (x) {
            return Math.cos(x);
        },

        function (x) {
            return Math.tan(x);
        },

        function (x) {
            return Math.exp(x);
        }
        ],
        functionsString = [
        "(1 + x + x^2)/(1 - x + x^2)",
        "x/(x^2 + x + 1)",
        "(5*x^2)/(x^2 + 2*x + 3)",
        "(2*x^3 - 4*x^2 + x + 1)/(x^2 + 3*x + 1)",
        "sin(x)",
        "cos(x)",
        "tan(x)",
        "exp(x)"
        ],
        left = -10,
        right = 10,
        step = 0.01;

    function load() {
        loadJson();
    }

    function loadJson() {
        d3.json('/TaylorApp/resources/big_derivatives.json', g);

        function g(data) {
            data = data || big_derivatives;

            var taylorFunctions = data.functions,
                taylorFunctionsLength = taylorFunctions.length,
                i,
                j,
                k,
                element,
                derivativesNumber,
                step,
                right,
                num,
                func,
                array,
                derivative;

            for (i = 0; i < taylorFunctionsLength; i += 1) {

                element = taylorFunctions[i];
                derivativesNumber = element.derivatesNumber;
                step = element.step;
                right = element.right;
                func = [];

                for (num = element.left, j = 0; num <= right; num += step, j +=1) {

                    func[j] = [];
                    array = func[j];

                    for (k = 0; k < derivativesNumber; k += 1) {

                        derivative = element.derivates[j][k] || 0;
                        array.push(derivative);
                    }
                }

                derivatives.push(func);
            }

            taylor.core.jsonGot();
        }
    }

    function getDerivatives() {
        return taylor.utils.extendDeep(derivatives);
    }

    function getFunction(i) {
        return functions[i];
    }

    function getFunctionString(i) {
        return functionsString[i];
    }

    function getTaylorAt(funcNum, point) {
        var index = Math.round((point - left)/step);
        return taylor.utils.extendDeep(derivatives[funcNum][index]);
    }

    function getLeft() {
        return left;
    }

    function getRight() {
        return right;
    }

    return {
        /**
         * Метод, который загружает массив производных в себя.
         * Он может их либо загружать напрямую
         */
        load: load,

        getDerivatives: getDerivatives,

        getFunction: getFunction,

        getFunctionString: getFunctionString,

        getTaylorAt: getTaylorAt,

        getRight: getRight,

        getLeft: getLeft
    }
})();

/**
 * Полиномы
 */
taylor.core.registerModule(function (app) {
    app.polynomial = function (polynomialCoefficients) {
        var i;

        if (typeof polynomialCoefficients === "undefined") {
            polynomialCoefficients = [];
            for (i = 0; i < constants.DEFAULT_DEGREE; i += 1) {
                polynomialCoefficients.push(0);
            }
        }

        if (Array.isArray(polynomialCoefficients)) {
            this.setCoefficients(polynomialCoefficients);

        } else {
            throw TypeError();
        }
    };

    app.polynomial.prototype.setCoefficients = function (polynomialCoefficients) {
        this.degree = polynomialCoefficients.length;
        this.coefficients = taylor.utils.extendDeep(polynomialCoefficients);
        this.func = function (x, point) {
            var i,
                value = 0,
                pow = 1;

            for (i = 0; i < this.degree; i += 1) {
                value += this.coefficients[i] * pow;
                pow *= (x - point);
            }

            return value;
        };
    };
});