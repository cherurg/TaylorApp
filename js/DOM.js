taylor.core.registerModule(function (app) {
    var self;
    app.DerivativesValue = function () {
        self = this;

        this.element = d3.select(this.elementID);
        this.element.on("input", this.activate);

        this.elementOutput = d3.select(this.elementOutputID);
    };

    app.DerivativesValue.prototype.resetDerivatives = function () {
        this.element[0][0].value = 0;
        this.elementOutput.text("0");
        this.activate();
    };
    app.DerivativesValue.prototype.elementID = "#derivatives";
    app.DerivativesValue.prototype.elementOutputID = "#derivativesNumber";
    app.DerivativesValue.prototype.activate = function () {
        var value = self.element[0][0].value;

        app.core.setDerivativesNumber(value);
        self.elementOutput.text("" + value - 1);
    }
});

taylor.core.registerModule(function (app) {
    app.FunctionChoose = function () {
        var self = this;

        this.number = 4;

        this.element = d3.select(this.elementID)
            .on("change", function () {
                app.core.setTaylorNumber(self.element[0][0].value);
            });
    };

    app.FunctionChoose.prototype.getFunctionNumber = function () {
        return this.element[0][0].value;
    };

    app.FunctionChoose.prototype.elementID = "#functionChoose";
});

taylor.core.registerModule(function (app) {
    app.Radius = function () {
        var self = this;

        this.element = d3.select(this.elementID);
    };

    app.Radius.prototype.elementID = "#radius";

    app.Radius.prototype.setRadius = function (value) {
        this.element.text("" + value);
    }
});