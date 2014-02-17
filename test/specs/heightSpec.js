describe("height", function() {

  describe("return correct size using percent", function() {
    it("container size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        height: "60%"
      });
      expect(ascensor.height()).toBe(WH / 100 * 60);
    });
    it("children size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        height: "70%"
      });
      ascensor.children("div").each(function(index, floor) {
        expect($(floor).height()).toBe(WH / 100 * 70);
      });
    });
  });

  describe("return correct size using pixel", function() {
    it("container size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        height: "200px"
      });
      expect(ascensor.height()).toBe(200);
    });
    it("children size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        height: "2400px"
      });
      ascensor.children("div").each(function(index, floor) {
        expect($(floor).height()).toBe(2400);
      });
    });
  });

  describe("return correct size using integer (convert to px)", function() {
    it("container size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        height: 100
      });
      expect(ascensor.height()).toBe(100);
    });

    it("children size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        height: 100
      });
      ascensor.children("div").each(function(index, floor) {
        expect($(floor).height()).toBe(100);
      });
    });
  });
});