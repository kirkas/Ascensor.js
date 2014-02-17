describe("direction", function() {

  var FloorSetup = function(ascensor) {
    expect(ascensor).toHaveCss({
      "position": "absolute",
      "top": "0px",
      "left": "0px",
      "overflow": "hidden",
      "height": WH + "px",
      "width": WW + "px"
    });
    ascensor.children("div").each(function(index, floor) {
      expect(floor).toHaveCss({
        "position": "absolute",
        "top": "0px",
        "left": "0px",
        "height": WH + "px",
        "width": WW + "px"
      });
    });
  }

  describe("y", function() {
    it("css is correctly applyed", function() {
      var ascensor = getInstanceOfAscensor();
      FloorSetup(ascensor);
    });
  });

  describe("x", function() {
    it("css is correctly applyed", function() {
      var ascensor = getInstanceOfAscensor({
        direction: "x"
      });
      FloorSetup(ascensor);
    });
  });

  describe("chocolate", function() {
    it("css is correctly applyed", function() {
      var ascensor = getInstanceOfAscensor({
        direction: "chocolate"
      });
      FloorSetup(ascensor);
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
      FloorSetup(ascensor);
    });

  });
});