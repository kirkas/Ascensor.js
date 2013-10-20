describe("Options", function() {

  var defaultTime = 300;
  var $fixture;
  var WW = $(window).width();
  var WH = $(window).height();
  var scrollEndSpy;
  var scrollStartSpy;

  beforeEach(function() {
    loadFixtures("ascensor.html");
    $fixture = $("#ascensorBuilding");
  });

  function getInstanceOfAscensor(parameter) {
    var fixture = $('<div id="ascensorBuilding"><div></div><div></div><div></div></div>');
    var ascensor = fixture.ascensor(parameter);
    return $fixture.ascensor(parameter);
  }

  function keyEventGenerator(key) {
    var e = jQuery.Event("keydown");
    e.which = key;
    e.keyCode = key;
    $(document).trigger(e);
  }

  describe("options", function() {
    describe("loop", function() {
      
      it("true (default)", function() {

        var ascensor = getInstanceOfAscensor({});
        var floorArray = new Object;

        ascensor.on("scrollStart", function(event, floor) {
          floorArray = floor;
        });

        ascensor.trigger("next").trigger("next").trigger("next").trigger("next");

        expect(floorArray.from).toBe(0);
        expect(floorArray.to).toBe(1);
        
        ascensor.trigger("prev").trigger("prev").trigger("prev").trigger("prev");
        
        expect(floorArray.from).toBe(1);
        expect(floorArray.to).toBe(0);

      });

      it("false", function() {
        var ascensor = getInstanceOfAscensor({
          loop: false
        });
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

    describe("direction", function() {

      describe("y", function() {
        it("size is correct", function() {
          var ascensor = getInstanceOfAscensor();
          expect(ascensor).toHaveCss({
            height: WH + "px"
          });
          expect(ascensor).toHaveCss({
            width: WW + "px"
          });
          ascensor.children("div").each(function(index, floor) {
            expect($(floor)).toHaveCss({
              height: WH + "px"
            });
            expect(floor).toHaveCss({
              width: WW + "px"
            });
          });
        });
      });

      describe("x", function() {
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
          var ascensor = getInstanceOfAscensor({
            direction: "x"
          });
          ascensor.children("div").each(function(index, floor) {
            expect(floor).toHaveCss({
              position: "absolute"
            });
            expect(floor).toHaveCss({
              left: index * WW + "px"
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
  });
});