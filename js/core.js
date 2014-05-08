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