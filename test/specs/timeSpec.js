describe("time", function() {

  it("use time option correctly when animated", function() {
    var ascensor = getInstanceOfAscensor();
    var spyEvent = spyOnEvent(ascensor, 'scrollEnd');

    ascensor.trigger('next');
    expect(spyEvent).not.toHaveBeenTriggered();

    setTimeout(function() {
      expect(spyEvent).toHaveBeenTriggered();
    }, defaultTime);

  });

});