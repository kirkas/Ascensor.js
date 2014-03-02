describe('keyNavigation', function()  {
  describe('true (default)', function() {
    describe('down', function() {
      it('trigger "scrollStart" event if direction is Y', function()  {
        var ascensor = getInstanceOfAscensor();
        var spyEvent = spyOnEvent(ascensor, 'scrollStart');

        // Arrow key down
        keyEventGenerator(KEY.DOWN);
        expect(spyEvent).toHaveBeenTriggered();
        spyEvent.reset();

        // S key
        keyEventGenerator(KEY.S);
        expect(spyEvent).toHaveBeenTriggered();
      });

      it('don t trigger "scrollStart" event if direction is X', function()  {
        var ascensor = getInstanceOfAscensor({
          direction: "x"
        });
        var spyEvent = spyOnEvent(ascensor, 'scrollStart');

        // arrow key down
        keyEventGenerator(KEY.DOWN);

        // Skey
        keyEventGenerator(KEY.S);
        expect(spyEvent).not.toHaveBeenTriggered();
      });
    });

    describe('up', function() {

      it('trigger "scrollStart" event with direction Y', function()  {
        var ascensor = getInstanceOfAscensor();

        keyEventGenerator(KEY.DOWN);
        keyEventGenerator(KEY.DOWN);

        var spyEvent = spyOnEvent(ascensor, 'scrollStart');

        // Arrow key uo
        keyEventGenerator(KEY.UP);
        expect(spyEvent).toHaveBeenTriggered();
        spyEvent.reset();

        // W key
        keyEventGenerator(KEY.W);
        expect(spyEvent).toHaveBeenTriggered();
      });


      it('don t trigger "scrollStart" event with direction X', function()  {
        var ascensor = getInstanceOfAscensor({
          direction: "x"
        });
        var spyEvent = spyOnEvent(ascensor, 'scrollStart');

        // arrow key up
        keyEventGenerator(KEY.UP);

        // W
        keyEventGenerator(KEY.W);
        expect(spyEvent).not.toHaveBeenTriggered();
      });

    });



    describe('right', function() {

      it('trigger "scrollStart" event with direction X', function()  {
        var ascensor = getInstanceOfAscensor({
          direction: "x"
        });

        var spyEvent = spyOnEvent(ascensor, 'scrollStart');

        // Arrow key right
        keyEventGenerator(KEY.RIGHT);
        expect(spyEvent).toHaveBeenTriggered();
        spyEvent.reset();

        // D key
        keyEventGenerator(KEY.D);
        expect(spyEvent).toHaveBeenTriggered();
      });


      it('don t trigger "scrollStart" event with direction Y', function()  {
        var ascensor = getInstanceOfAscensor();
        var spyEvent = spyOnEvent(ascensor, 'scrollStart');

        // arrow key right
        keyEventGenerator(KEY.RIGHT);

        // D
        keyEventGenerator(KEY.D);
        expect(spyEvent).not.toHaveBeenTriggered();
      });

    });



    describe('left', function() {

      it('trigger "scrollStart" event with direction X', function()  {
        var ascensor = getInstanceOfAscensor({
          direction: "x"
        });
        keyEventGenerator(KEY.RIGHT);
        keyEventGenerator(KEY.RIGHT);
        var spyEvent = spyOnEvent(ascensor, 'scrollStart');

        // Arrow key right
        keyEventGenerator(KEY.LEFT);
        expect(spyEvent).toHaveBeenTriggered();
        spyEvent.reset();

        // D key
        keyEventGenerator(KEY.A);
        expect(spyEvent).toHaveBeenTriggered();
      });


      it('don t trigger "scrollStart" event with direction Y', function()  {
        var ascensor = getInstanceOfAscensor();
        var spyEvent = spyOnEvent(ascensor, 'scrollStart');

        // arrow key right
        keyEventGenerator(KEY.LEFT);

        // D
        keyEventGenerator(KEY.A);
        expect(spyEvent).not.toHaveBeenTriggered();
      });

    });


  });

  describe('false', function() {
    it('all key on direction Y don t trigger event ', function() {
      var ascensor = getInstanceOfAscensor({
        keyNavigation: false
      });
      var spyEvent = spyOnEvent(ascensor, 'scrollStart');
      keyEventGenerator(KEY.LEFT);
      keyEventGenerator(KEY.RIGHT);
      keyEventGenerator(KEY.UP);
      keyEventGenerator(KEY.DOWN);
      keyEventGenerator(KEY.A);
      keyEventGenerator(KEY.S);
      keyEventGenerator(KEY.W);
      keyEventGenerator(KEY.D);
      expect(spyEvent).not.toHaveBeenTriggered();
    });

    it('all key on direction X don t trigger event ', function() {
      var ascensor = getInstanceOfAscensor({
        keyNavigation: false,
        direction: 'x'
      });
      var spyEvent = spyOnEvent(ascensor, 'scrollStart');
      keyEventGenerator(KEY.LEFT);
      keyEventGenerator(KEY.RIGHT);
      keyEventGenerator(KEY.UP);
      keyEventGenerator(KEY.DOWN);
      keyEventGenerator(KEY.A);
      keyEventGenerator(KEY.S);
      keyEventGenerator(KEY.W);
      keyEventGenerator(KEY.D);
      expect(spyEvent).not.toHaveBeenTriggered();
    });

    it('all key on direction Chocolate don t trigger event ', function() {
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
        ],
        keyNavigation: false
      };
      var ascensor = getInstanceOfAscensor(parameter);

      var spyEvent = spyOnEvent(ascensor, 'scrollStart');
      keyEventGenerator(KEY.LEFT);
      keyEventGenerator(KEY.RIGHT);
      keyEventGenerator(KEY.UP);
      keyEventGenerator(KEY.DOWN);
      keyEventGenerator(KEY.A);
      keyEventGenerator(KEY.S);
      keyEventGenerator(KEY.W);
      keyEventGenerator(KEY.D);
      expect(spyEvent).not.toHaveBeenTriggered();
    });
  });
});