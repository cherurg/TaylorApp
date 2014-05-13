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


