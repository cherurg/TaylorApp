taylor.core.registerModule(function (app) {
    app.DerivativesValue = function () {
        var self = this;

        this.element = d3.select(this.elementID);
        this.element.on("input", function () {
            var value = self.element[0][0].value;

            app.core.setDerivativesNumber(value);
            self.elementOutput.text("" + value - 1);
        });

        this.elementOutput = d3.select(this.elementOutputID);
    };

    app.DerivativesValue.prototype.elementID = "#derivatives";
    app.DerivativesValue.prototype.elementOutputID = "#derivativesNumber";
});

taylor.core.registerModule(function (app) {
    app.FunctionChoose = function () {
        var self = this;

        this.number = 4;

        this.element = d3.select("#functionChoose")
            .on("change", function () {
                app.core.setTaylorNumber(self.element[0][0].value);
            });
    };

    app.FunctionChoose.prototype.getFunctionNumber = function () {
        return this.element[0][0].value;
    }
});
