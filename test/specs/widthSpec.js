describe("width", function() {

  describe("return correct size using percent", function() {
    it("container size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        width: "60%"
      });
      var ascensorWidth = Math.round(parseInt(ascensor.width()));
      var excpectedWidth = Math.round(WW / 100 * 60);
      expect(ascensorWidth).toBe(excpectedWidth);
    });
    it("children size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        width: "20%"
      });
      ascensor.children("div").each(function(index, floor) {
        var floorWidth = Math.round(parseInt($(floor).width()));
        var excpectedWidth = Math.round(WW / 100 * 20);
        expect(floorWidth).toBe(excpectedWidth);
      });
    });
  });

  describe("return correct size using pixel", function() {
    it("container size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        width: "200px"
      });
      expect(ascensor).toHaveCss({
        width: "200px"
      });
    });
    it("children size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        width: "2400px"
      });
      ascensor.children("div").each(function(index, floor) {
        expect(floor).toHaveCss({
          width: "2400px"
        });
      });
    });
  });

  describe("return correct size using integer (convert to px)", function() {
    it("container size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        width: 100
      });
      expect(ascensor).toHaveCss({
        width: "100px"
      });
    });

    it("children size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        width: 100
      });
      ascensor.children("div").each(function(index, floor) {
        expect(floor).toHaveCss({
          width: "100px"
        });
      });
    });
  });
});