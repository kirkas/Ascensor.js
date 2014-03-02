describe("loop", function() {
  it("true", function() {

    var ascensor = getInstanceOfAscensor({
      loop: true
    });
    var floorArray;
    var spyEvent = spyOnEvent(ascensor, "scrollStart");

    ascensor.on("scrollStart", function(event, floor) {
      floorArray = floor;
    });



    ascensor.trigger("next");
    expect(floorArray.from).toBe(0);
    expect(floorArray.to).toBe(1);
    expect(spyEvent).toHaveBeenTriggered();
    spyEvent.reset();

    ascensor.trigger("next");
    expect(floorArray.from).toBe(1);
    expect(floorArray.to).toBe(2);
    expect(spyEvent).toHaveBeenTriggered();
    spyEvent.reset();

    ascensor.trigger("next");
    expect(floorArray.from).toBe(2);
    expect(floorArray.to).toBe(0);
    expect(spyEvent).toHaveBeenTriggered();
    spyEvent.reset();


    ascensor.trigger("prev");
    expect(floorArray.from).toBe(0);
    expect(floorArray.to).toBe(2);
    expect(spyEvent).toHaveBeenTriggered();
    spyEvent.reset();

    ascensor.trigger("prev");
    expect(floorArray.from).toBe(2);
    expect(floorArray.to).toBe(1);
    expect(spyEvent).toHaveBeenTriggered();
    spyEvent.reset();

    ascensor.trigger("prev");
    expect(floorArray.from).toBe(1);
    expect(floorArray.to).toBe(0);
    expect(spyEvent).toHaveBeenTriggered();

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