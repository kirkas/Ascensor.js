describe("height", function() {

  describe("return correct size using percent", function() {
    it("container size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        height: "60%"
      });
      var ascensorHeight = Math.round(parseInt(ascensor.height()));
      var excpectedHeight = Math.round(WH / 100 * 60);
      expect(ascensorHeight).toBe(excpectedHeight);
    });

  });

  describe("return correct size using pixel", function() {
    it("container size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        height: "200px"
      });
      expect(ascensor).toHaveCss({
        height: "200px"
      });
    });
    it("children size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        height: "2400px"
      });
      ascensor.children("div").each(function(index, floor) {
        expect(floor).toHaveCss({
          height: "2400px"
        });
      });
    });
  });

  describe("return correct size using integer (convert to px)", function() {
    it("container size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        height: 100
      });
      expect(ascensor).toHaveCss({
        height: "100px"
      });
    });

    it("children size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        height: 100
      });
      ascensor.children("div").each(function(index, floor) {
        expect(floor).toHaveCss({
          height: "100px"
        });
      });
    });
  });
});