describe("direction", function() {

  describe("y", function() {
    it("css", function() {
      var ascensor = getInstanceOfAscensor();

      ascensor.children("div").each(function(index, floor) {

      });
    });
  });

  describe("x", function() {
    it("position is correct", function() {
      var ascensor = getInstanceOfAscensor({
        direction: "x"
      });
      ascensor.children("div").each(function(index, floor) {
        expect(floor).toHaveCss({
          position: "absolute"
        });
      });
    });
  });

  describe("chocolate", function() {
    it("size is correct", function() {
      var ascensor = getInstanceOfAscensor();
      expect(ascensor).toHaveCss({
        height: WH + "px"
      });
      expect(ascensor).toHaveCss({
        width: WW + "px"
      });
      ascensor.children("div").each(function(index, floor) {
        expect(floor).toHaveCss({
          height: WH + "px"
        });
        expect(floor).toHaveCss({
          width: WW + "px"
        });
      });
    });
    it("position is correct", function() {
      var R1 = 1 + Math.floor(Math.random() * 30);
      var R2 = 1 + Math.floor(Math.random() * 30);
      var R3 = 1 + Math.floor(Math.random() * 30);
      var R4 = 1 + Math.floor(Math.random() * 30);
      var R5 = 1 + Math.floor(Math.random() * 30);
      var R6 = 1 + Math.floor(Math.random() * 30);
      var parameter = {
        direction: [
          [R1, R2],
          [R3, R4],
          [R5, R6]
        ]
      }
      var ascensor = getInstanceOfAscensor(parameter);
      ascensor = $fixture.ascensor(parameter);
      ascensor.children("div").each(function(index, elements) {
        expect(elements).toHaveCss({
          position: "absolute"
        });
        expect(elements).toHaveCss({
          left: parameter.direction[index][1] * WW + "px"
        });
        expect(elements).toHaveCss({
          top: parameter.direction[index][0] * WH + "px"
        });
      });
    });
  });

});