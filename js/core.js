var core = (function () {

    var graph;

    function init() {

        //todo: доработать simple-graph до нужного состояния. Постоянное количество точек на каждом участке, бесконечная прорисовка функций, цвет графика, возможность добавления своих функций. Это для начала.
        graph = new SimpleGraph("chart1", {
            "xmax": 60, "xmin": 0,
            "ymax": 40, "ymin": 0,
            "title": "Simple Graph1",
            "xlabel": "X Axis",
            "ylabel": "Y Axis"
        });
    }

    return {
        init: init
    };
})();

var utils = (function () {

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

var derivativesLoader = (function () {

    var derivatives = [];

    function load() {
        loadJson();
    }

    function loadJson() {
        d3.json('/Taylor/Matlab/derivates.json', function (data) {
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

            core.jsonGot();
        });
    }

    function getDerivatives() {
        return utils.extendDeep(derivatives);
    }

    return {
        /**
         * Метод, который загружает массив производных в себя.
         * Он может их либо загружать напрямую
         */
        load: load,

        getDerivatives: getDerivatives
    }
})();