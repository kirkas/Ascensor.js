describe("context", function() {
  describe("default ($(window))", function() {
    it("container size is correct", function() {
      var ascensor = getWrappedOfAscensor();
      var ascensorWidth = Math.round(parseInt(ascensor.width()));
      var excpectedWidth = Math.round(WW);
      var ascensorHeight = Math.round(parseInt(ascensor.height()));
      var excpectedHeight = Math.round(WH);
      expect(ascensorWidth).toBe(excpectedWidth);
      expect(ascensorHeight).toBe(excpectedHeight);
    });
  });

  describe("using custom context", function() {
    it("container size is correct", function() {
      var ascensor = getWrappedOfAscensor({
        context: $fixtureWrapper
      });
      var ascensorWidth = Math.round(parseInt(ascensor.width()));
      var excpectedWidth = Math.round($fixtureWrapper.width());
      var ascensorHeight = Math.round(parseInt(ascensor.height()));
      var excpectedHeight = Math.round($fixtureWrapper.height());
      expect(ascensorWidth).toBe(excpectedWidth);
      expect(ascensorHeight).toBe(excpectedHeight);
    });


    it("custom height/width", function() {
      var ascensor = getWrappedOfAscensor({
        context: $fixtureWrapper,
        height: "10%",
        width: "50%"
      });
      var ascensorWidth = Math.round(parseInt(ascensor.width()));
      var excpectedWidth = Math.round($fixtureWrapper.width() / 100 * 50);
      var ascensorHeight = Math.round(parseInt(ascensor.height()));
      var excpectedHeight = Math.round($fixtureWrapper.height() / 100 * 10);
      expect(ascensorWidth).toBe(excpectedWidth);
      expect(ascensorHeight).toBe(excpectedHeight);
    });
  });
});