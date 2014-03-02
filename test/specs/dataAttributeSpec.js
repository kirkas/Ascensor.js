describe("data-attribute", function() {

  it('next', function() {
    $fixture.children().eq(0).data('ascensor-next', 2);
    var ascensor = getInstanceOfAscensor();
    ascensor.trigger('next');
    expect(ascensor.data('current-floor')).toBe(2);
  });

  it('prev', function() {
    $fixture.children().eq(0).data('ascensor-prev', 2);
    var ascensor = getInstanceOfAscensor();
    ascensor.trigger('prev');
    expect(ascensor.data('current-floor')).toBe(2);
  });

  it('up', function() {
    $fixture.children().eq(0).data('ascensor-up', 2);
    var ascensor = getInstanceOfAscensor();
    ascensor.trigger('scrollToDirection', 'up');
    expect(ascensor.data('current-floor')).toBe(2);
  });

  it('down', function() {
    $fixture.children().eq(0).data('ascensor-down', 2);
    var ascensor = getInstanceOfAscensor();
    ascensor.trigger('scrollToDirection', 'down');
    expect(ascensor.data('current-floor')).toBe(2);
  });

  it('left', function() {
    $fixture.children().eq(0).data('ascensor-left', 2);
    var ascensor = getInstanceOfAscensor();
    ascensor.trigger('scrollToDirection', 'left');
    expect(ascensor.data('current-floor')).toBe(2);
  });

  it('right', function() {
    $fixture.children().eq(0).data('ascensor-right', 2);
    var ascensor = getInstanceOfAscensor();
    ascensor.trigger('scrollToDirection', 'right');
    expect(ascensor.data('current-floor')).toBe(2);
  });

});