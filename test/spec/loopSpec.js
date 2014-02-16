describe("loop", function() {
  it("true", function() {

    var ascensor = getInstanceOfAscensor({
      loop: true
    });
    var floorArray = new Object;
    var spyOnEventScrollStart = spyOnEvent(ascensor, "scrollStart");

    ascensor.on("scrollStart", function(event, floor) {
      floorArray = floor;
    });

    ascensor.trigger("next").trigger("next").trigger("next").trigger("next");

    expect(floorArray.from).toBe(0);
    expect(floorArray.to).toBe(1);

    expect(spyOnEventScrollStart).toHaveBeenTriggered();
    spyOnEventScrollStart.reset();

    ascensor.trigger("prev").trigger("prev").trigger("prev").trigger("prev");
    expect(spyOnEventScrollStart).toHaveBeenTriggered();

    expect(floorArray.from).toBe(1);
    expect(floorArray.to).toBe(0);
    expect(ascensor.data("current-floor")).toBe(0);
  });

  it("false", function() {
    var ascensor = getInstanceOfAscensor();
    var floorArray;

    ascensor.on("scrollStart", function(event, floor) {
      floorArray = floor;
    });

    ascensor.trigger("next").trigger("next").trigger("next").trigger("next").trigger("next");
    expect(floorArray.from).toBe(1);
    expect(floorArray.to).toBe(2);

    ascensor.trigger("prev").trigger("prev").trigger("prev").trigger("prev").trigger("prev");
    expect(floorArray.from).toBe(1);
    expect(floorArray.to).toBe(0);
  });
});