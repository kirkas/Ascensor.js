describe("Triggers", function() {


  it("scrollStart", function() {
    var ascensor = getInstanceOfAscensor();
    var scrollStartSpy = spyOnEvent(ascensor, "scrollStart");
    ascensor.trigger("next");
    expect(scrollStartSpy).toHaveBeenTriggered();
  });

  it("scrollEnd", function() {
    var ascensor = getInstanceOfAscensor({
      time: defaultTime
    });
    var scrollEndSpy = spyOnEvent(ascensor, "scrollEnd");

    setTimeout(function() {
      expect(scrollEndSpy).toHaveBeenTriggered();
    }, defaultTime);

  });


  describe("scrollToStage", function() {
    it("interger", function() {
      var floorFrom;
      var floorTo;
      var ascensor = getInstanceOfAscensor();

      ascensor.on("scrollStart", function(event, floor) {
        floorFrom = floor.from;
        floorTo = floor.to;
      });

      ascensor.trigger("scrollToStage", 1);
      expect(floorFrom).toBe(0);
      expect(floorTo).toBe(1);

      ascensor.trigger("scrollToStage", 2);
      expect(floorFrom).toBe(1);
      expect(floorTo).toBe(2);

      ascensor.trigger("scrollToStage", 0);
      expect(floorFrom).toBe(2);
      expect(floorTo).toBe(0);
    });

    it("floor name", function() {
      var floorFrom;
      var floorTo;

      var ascensor = getInstanceOfAscensor({
        ascensorFloorName: ["one", "two", "three"]
      });

      ascensor.on("scrollStart", function(event, floor) {
        floorFrom = floor.from;
        floorTo = floor.to;
      });

      ascensor.trigger("scrollToStage", "two");
      expect(floorFrom).toBe(0);
      expect(floorTo).toBe(1);

      ascensor.trigger("scrollToStage", "three");
      expect(floorFrom).toBe(1);
      expect(floorTo).toBe(2);

      ascensor.trigger("scrollToStage", "one");
      expect(floorFrom).toBe(2);
      expect(floorTo).toBe(0);

    });
  });



  it("next", function() {
    var ascensor = getInstanceOfAscensor();
    ascensor.on("scrollStart", function(event, floor) {
      expect(floor.from).toBe(0);
      expect(floor.to).toBe(1);
    });

    ascensor.trigger("next");
  });
  it("prev", function() {
    var ascensor = getInstanceOfAscensor();
    ascensor.on("scrollStart", function(event, floor) {
      expect(floor.from).toBe(0);
      expect(floor.to).toBe(2);
    });

    ascensor.trigger("prev");
  });



  it("Refresh", function() {
    var ascensor = getInstanceOfAscensor();

    var floor = $("<div></div>");

    ascensor.append(floor);
    ascensor.trigger("refresh");

    expect($(floor)).toHaveCss({
      position: "absolute",
      height: WH + "px",
      width: WW + "px"
    });

  });

});