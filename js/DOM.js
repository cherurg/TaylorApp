taylor.core.registerModule(function (app) {
    app.DerivativesValue = function () {
        this.element = d3.select(this.elementID);
        console.log("DerivativesValue: " + this.element[0][0].value);
    };

    app.DerivativesValue.prototype.elementID = "#derivatives";
});


