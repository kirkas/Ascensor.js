describe('direction', function() {

  var FloorSetup = function(ascensor) {
    expect(ascensor).toHaveCss({
      'position': 'absolute',
      'top': '0px',
      'left': '0px',
      'overflow': 'hidden',
      'height': WH + 'px',
      'width': WW + 'px'
    });
    ascensor.children('div').each(function(index, floor) {
      expect(floor).toHaveCss({
        'position': 'absolute',
        'height': WH + 'px',
        'width': WW + 'px'
      });
    });
  };

  describe('y', function() {
    it('css is correctly applyed', function() {
      var ascensor = getInstanceOfAscensor();
      FloorSetup(ascensor);
    });
    it('children are correctly positioned', function() {
      var ascensor = getInstanceOfAscensor();
      ascensor.children('div').each(function(index, floor) {
        if (has3d()) {
          expect(parseInt(getTransform(floor)[1])).toBe(index * WH);
          expect(parseInt(getTransform(floor)[0])).toBe(0);
        } else {
          expect(parseInt($(floor).css('top'))).toBe(index * WH);
          expect(parseInt($(floor).css('left'))).toBe(0);
        }
      });
    });
  });

  describe('x', function() {
    it('css is correctly applyed', function() {
      var ascensor = getInstanceOfAscensor({
        direction: 'x'
      });
      FloorSetup(ascensor);
    });
    it('children are correctly positioned', function() {
      var ascensor = getInstanceOfAscensor({
        direction: 'x'
      });
      ascensor.children('div').each(function(index, floor) {
        if (has3d()) {
          expect(parseInt(getTransform(floor)[0])).toBe(index * WW);
          expect(parseInt(getTransform(floor)[1])).toBe(0);
        } else {
          expect(parseInt($(floor).css('top'))).toBe(0);
          expect(parseInt($(floor).css('left'))).toBe(index * WW);
        }
      });
    });
  });

  describe('chocolate', function() {
    it('css is correctly applyed', function() {
      var ascensor = getInstanceOfAscensor({
        direction: 'chocolate'
      });
      FloorSetup(ascensor);
    });

    it('children are correctly positioned', function() {
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
      };
      var ascensor = getInstanceOfAscensor(parameter);
      FloorSetup(ascensor);

      ascensor.children('div').each(function(index, floor) {
        if (has3d()) {
          expect(parseInt(getTransform(floor)[1])).toBe(parameter.direction[index][0] * WH);
          expect(parseInt(getTransform(floor)[0])).toBe(parameter.direction[index][1] * WW);
        } else {
          expect(parseInt($(floor).css('top'))).toBe(parameter.direction[index][0] * WH);
          expect(parseInt($(floor).css('left'))).toBe(parameter.direction[index][1] * WW);
        }
      });


    });

  });
});