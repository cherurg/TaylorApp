var taylor = taylor || {};

taylor.core = (function () {

    var graph,
        derivatives,
        polynomial;

    function init() {

        //todo: доработать simple-graph до нужного состояния. Постоянное количество точек на каждом участке, бесконечная прорисовка функций, цвет графика, возможность добавления своих функций. Это для начала.

        taylor.derivativesLoader.load();
    }

    function jsonGot() {

        derivatives = taylor.derivativesLoader.getDerivatives();


/*        var pol2 = new taylor.polynomial(derivatives[0][1500]);

        console.log(polynomial.func(0));
        console.log(pol2.func(0));*/
        //console.log("json got! Derivatives length: " + derivatives.length);

        polynomial = new taylor.polynomial(derivatives[0][1001]);
        /*var str = "[";
        for (var i = 0; i < derivatives[0][1001].length - 1; i += 1) {
            str += derivatives[0][1001][i] + ", ";
        }
        str += derivatives[0][1001][derivatives[0][1001].length - 1] + "]";
        console.log(str);*/
        //console.log(polynomial.func(0));
        graph = new taylor.SimpleGraph("chart1", {
            "xmax": 60, "xmin": 0,
            "ymax": 40, "ymin": 0,
            "title": "Simple Graph1",
            "xlabel": "X Axis",
            "ylabel": "Y Axis",
            "func": function (x) { return polynomial.func(x); }
        });
        //graph.setFunctions(polynomial.func);
    }

    function registerModule(func) {
        func(taylor);
    }

    return {
        init: init,

        jsonGot: jsonGot,

        registerModule: registerModule
    };
})();

//todo: создать утилиту, проверяющую тип данных.
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

    var derivatives = [];

    var functions = [
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
    ];

    var functionsString = [
        "(1 + x + x^2)/(1 - x + x^2)",
        "x/(x^2 + x + 1)",
        "(5*x^2)/(x^2 + 2*x + 3)",
        "(2*x^3 - 4*x^2 + x + 1)/(x^2 + 3*x + 1)",
        "sin(x)",
        "cos(x)",
        "tan(x)",
        "exp(x)"
    ];

    function load() {
        loadJson();
    }

    function loadJson() {
        d3.json('/TaylorApp/resources/derivatives.json', function (data) {
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
        });
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

    return {
        /**
         * Метод, который загружает массив производных в себя.
         * Он может их либо загружать напрямую
         */
        load: load,

        getDerivatives: getDerivatives,

        getFunction: getFunction,

        getFunctionString: getFunctionString
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
        this.func = function (x) {
            var i,
                value = 0,
                pow = 1;

            for (i = 0; i < this.degree; i += 1) {
                value += this.coefficients[i] * pow;
                pow *= x;
            }

            return value;
        };
    };
});