describe("scrollToDirection", function() {
  describe("down", function()  {
    it("return correct floor attribute", function() {
      var floorFrom;
      var floorTo;
      var ascensor = getInstanceOfAscensor({
        loop: true
      });
      ascensor.on("scrollStart", function(event, floor) {
        floorFrom = floor.from;
        floorTo = floor.to;
      });
      ascensor.trigger("scrollToDirection", "down");
      expect(floorFrom).toBe(0);
      expect(floorTo).toBe(1);
    });
    it("return undefined if wrong axis", function() {
      var floorFrom;
      var floorTo;
      var ascensor = getInstanceOfAscensor({
        loop: true,
        direction: "x"
      });
      ascensor.on("scrollStart", function(event, floor) {
        floorFrom = floor.from;
        floorTo = floor.to;
      });
      ascensor.trigger("scrollToDirection", "down");
      expect(floorFrom).toBe(undefined);
      expect(floorTo).toBe(undefined);
    });
  });

  describe("up", function()  {
    it("return correct floor attribute", function() {
      var floorFrom;
      var floorTo;
      var ascensor = getInstanceOfAscensor({
        loop: true
      });
      ascensor.on("scrollStart", function(event, floor) {
        floorFrom = floor.from;
        floorTo = floor.to;
      });
      ascensor.trigger("scrollToDirection", "up");
      expect(floorFrom).toBe(0);
      expect(floorTo).toBe(2);

    });

    it("return undefined if wrong axis", function() {
      var floorFrom;
      var floorTo;
      var ascensor = getInstanceOfAscensor({
        loop: true,
        direction: "x"
      });
      ascensor.on("scrollStart", function(event, floor) {
        floorFrom = floor.from;
        floorTo = floor.to;
      });
      ascensor.trigger("scrollToDirection", "up");
      expect(floorFrom).toBe(undefined);
      expect(floorTo).toBe(undefined);
    });
  });
  describe("left", function() {
    it("return correct floor attribute", function() {
      var floorFrom;
      var floorTo;
      var ascensor = getInstanceOfAscensor({
        loop: true,
        direction: "x"
      });
      ascensor.on("scrollStart", function(event, floor) {
        floorFrom = floor.from;
        floorTo = floor.to;
      });
      ascensor.trigger("scrollToDirection", "left");
      expect(floorFrom).toBe(0);
      expect(floorTo).toBe(2);
    });

    it("return undefined if wrong axis", function() {
      var floorFrom;
      var floorTo;
      var ascensor = getInstanceOfAscensor({
        loop: true
      });
      ascensor.on("scrollStart", function(event, floor) {
        floorFrom = floor.from;
        floorTo = floor.to;
      });
      ascensor.trigger("scrollToDirection", "left");
      expect(floorFrom).toBe(undefined);
      expect(floorTo).toBe(undefined);
    });
  });
  describe("right", function() {
    it("return correct floor attribute", function() {
      var floorFrom;
      var floorTo;
      var ascensor = getInstanceOfAscensor({
        loop: true,
        direction: "x"
      });
      ascensor.on("scrollStart", function(event, floor) {
        floorFrom = floor.from;
        floorTo = floor.to;
      });
      ascensor.trigger("scrollToDirection", "right");
      expect(floorFrom).toBe(0);
      expect(floorTo).toBe(1);
    });
    it("return undefined if wrong axis", function() {
      var floorFrom;
      var floorTo;
      var ascensor = getInstanceOfAscensor({
        loop: true
      });
      ascensor.on("scrollStart", function(event, floor) {
        floorFrom = floor.from;
        floorTo = floor.to;
      });
      ascensor.trigger("scrollToDirection", "right");
      expect(floorFrom).toBe(undefined);
      expect(floorTo).toBe(undefined);
    });
  });
});