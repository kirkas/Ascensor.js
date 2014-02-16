describe("keyNavigation", function() {
  describe("true (default)", function() {
    describe("down direction", function() {

      it("down arrow, direction Y, return true", function() {
        var ascensor = getInstanceOfAscensor();
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(40);
        expect(scrollStartSpy).toHaveBeenTriggered();
      });
      it("down arrow, direction X, return false", function() {
        var ascensor = getInstanceOfAscensor({
          direction: "x"
        });
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(40);
        expect(scrollStartSpy).not.toHaveBeenTriggered();
      });
      it("S key, direction Y, return true", function() {
        var ascensor = getInstanceOfAscensor();
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(83);
        expect(scrollStartSpy).toHaveBeenTriggered();
      });


      it("S key, direction X, return false", function() {
        var ascensor = getInstanceOfAscensor({
          direction: "x"
        });
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(83);
        expect(scrollStartSpy).not.toHaveBeenTriggered();
      });

    });

    describe("up direction", function() {
      it("up arrow, direction Y, return true", function() {
        var ascensor = getInstanceOfAscensor();
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(38);
        expect(scrollStartSpy).toHaveBeenTriggered();
      });

      it("up arrow, direction X, return false", function() {
        var ascensor = getInstanceOfAscensor({
          direction: "x"
        });
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(38);
        expect(scrollStartSpy).not.toHaveBeenTriggered();
      });

      it("W key, direction Y, return true", function() {
        var ascensor = getInstanceOfAscensor();
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(87);
        expect(scrollStartSpy).toHaveBeenTriggered();
      });

      it("W key, direction X, return false", function() {
        var ascensor = getInstanceOfAscensor({
          direction: "x"
        });
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(87);
        expect(scrollStartSpy).not.toHaveBeenTriggered();
      });
    });


    describe("left direction", function() {
      it("left arrow, direction X, return true", function() {
        var ascensor = getInstanceOfAscensor({
          direction: "x"
        });
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(37);
        expect(scrollStartSpy).toHaveBeenTriggered();
      });

      it("left arrow, direction Y, return false", function() {
        var ascensor = getInstanceOfAscensor();
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(37);
        expect(scrollStartSpy).not.toHaveBeenTriggered();
      });

      it("A key, direction X, return true", function() {
        var ascensor = getInstanceOfAscensor({
          direction: "x"
        });
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(65);
        expect(scrollStartSpy).toHaveBeenTriggered();
      });


      it("A key, direction Y, return false", function() {
        var ascensor = getInstanceOfAscensor();
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(65);
        expect(scrollStartSpy).not.toHaveBeenTriggered();
      });
    });

    describe("right direction", function() {
      it("right arrow, direction X, return true", function() {
        var ascensor = getInstanceOfAscensor({
          direction: "x"
        });
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(39);
        expect(scrollStartSpy).toHaveBeenTriggered();
      });

      it("right arrow, direction Y, return false", function() {
        var ascensor = getInstanceOfAscensor();
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(39);
        expect(scrollStartSpy).not.toHaveBeenTriggered();
      });

      it("D key, direction X, return true", function() {
        var ascensor = getInstanceOfAscensor({
          direction: "x"
        });
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(68);
        expect(scrollStartSpy).toHaveBeenTriggered();
      });


      it("D key, direction Y, return false", function() {
        var ascensor = getInstanceOfAscensor();
        scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
        keyEventGenerator(68);
        expect(scrollStartSpy).not.toHaveBeenTriggered();
      });
    });

  });
  describe("false", function() {
    it("all key on direction Y return false", function() {
      var ascensor = getInstanceOfAscensor({
        keyNavigation: false
      });
      scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
      keyEventGenerator(40);
      keyEventGenerator(83);
      keyEventGenerator(38);
      keyEventGenerator(87);
      keyEventGenerator(37);
      keyEventGenerator(65);
      keyEventGenerator(39);
      keyEventGenerator(68);
      expect(scrollStartSpy).not.toHaveBeenTriggered();
    });

    it("all key on direction X return false", function() {
      var ascensor = getInstanceOfAscensor({
        keyNavigation: false,
        direction: "x"
      });
      scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
      keyEventGenerator(40);
      keyEventGenerator(83);
      keyEventGenerator(38);
      keyEventGenerator(87);
      keyEventGenerator(37);
      keyEventGenerator(65);
      keyEventGenerator(39);
      keyEventGenerator(68);
      expect(scrollStartSpy).not.toHaveBeenTriggered();
    });

    it("all key on direction Chocolate return false", function() {
      var R1 = 1 + Math.floor(Math.random() * 30);
      var R2 = 1 + Math.floor(Math.random() * 30);
      var R3 = 1 + Math.floor(Math.random() * 30);
      var R4 = 1 + Math.floor(Math.random() * 30);
      var R5 = 1 + Math.floor(Math.random() * 30);
      var R6 = 1 + Math.floor(Math.random() * 30);
      var parameter = {
        direction: "chocolate",
        direction: [
          [R1, R2],
          [R3, R4],
          [R5, R6]
        ],
        keyNavigation: false
      }
      var ascensor = getInstanceOfAscensor(parameter);

      scrollStartSpy = spyOnEvent(ascensor, "scrollToDirection");
      keyEventGenerator(40);
      keyEventGenerator(83);
      keyEventGenerator(38);
      keyEventGenerator(87);
      keyEventGenerator(37);
      keyEventGenerator(65);
      keyEventGenerator(39);
      keyEventGenerator(68);
      expect(scrollStartSpy).not.toHaveBeenTriggered();
    });
  });
});