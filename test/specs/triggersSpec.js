describe("Triggers", function() {

  describe("Plugins triggers", function() {
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
  });

  describe("Users triggers", function() {
    it("scrollToDirection", function() {
      var ascensor = getInstanceOfAscensor();
      ascensor.on("scrollStart", function(event, floor) {
        expect(floor.from).toBe(0);
        expect(floor.to).toBe(1);
      });

      ascensor.trigger("scrollToDirection", "down");
    });

    it("scrollToStage", function() {
      var ascensor = getInstanceOfAscensor();
      ascensor.on("scrollStart", function(event, floor) {
        expect(floor.from).toBe(0);
        expect(floor.to).toBe(2);
      });

      ascensor.trigger("scrollToStage", 2);
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
  });

  // describe("Refresh on dom change", function() {
  //   it("append element", function() {
  //     var ascensor = getInstanceOfAscensor();

  //     var floor = $("<div></div>");
  //     console.log(floor);
  //     affix(floor)
  //     ascensor.append(floor);
  //     ascensor.trigger("refresh");
  //     console.log(floor);
  //     expect().toHaveCss({
  //       position: "absolute"
  //     });

  //   });

  // });

});