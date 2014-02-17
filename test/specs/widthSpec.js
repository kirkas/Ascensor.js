describe("width", function() {

  describe("return correct size using percent", function() {
    it("container size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        width: "60%"
      });
      expect(ascensor.width()).toBe(WW / 100 * 60);
    });
    it("children size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        width: "70%"
      });
      ascensor.children("div").each(function(index, floor) {
        expect($(floor).width()).toBe(WW / 100 * 70);
      });
    });
  });

  describe("return correct size using pixel", function() {
    it("container size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        width: "200px"
      });
      expect(ascensor.width()).toBe(200);
    });
    it("children size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        width: "2400px"
      });
      ascensor.children("div").each(function(index, floor) {
        expect($(floor).width()).toBe(2400);
      });
    });
  });

  describe("return correct size using integer (convert to px)", function() {
    it("container size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        width: 100
      });
      expect(ascensor.width()).toBe(100);
    });

    it("children size is correct", function() {
      var ascensor = getInstanceOfAscensor({
        width: 100
      });
      ascensor.children("div").each(function(index, floor) {
        expect($(floor).width()).toBe(100);
      });
    });
  });
});