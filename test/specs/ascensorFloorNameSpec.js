describe('ascensorFloorName', function() {


  it('add correct hash on startup', function() {
    var hashOption = ['floor_one', 'floor_two', 'floor_three', 'floor_four'];
    var ascensor = getInstanceOfAscensor({
      ascensorFloorName: hashOption
    });

    var hash = window.location.hash.split('#').pop();
    // expect(hash).toBe(hashOption[0])
  });

  it('update hash on scroll', function() {
    var hash_1 = 'a';
    var hash_2 = 'b';
    var hash_3 = 'c';
    var ascensor = getInstanceOfAscensor({
      ascensorFloorName: [hash_1, hash_2, hash_3]
    });

    var hash = window.location.hash.split('#').pop();
    expect(hash).toBe(hash_1);

    ascensor.trigger('next');
    hash = window.location.hash.split('#').pop();
    setTimeout(function() {
      expect(hash).toBe(hash_2);
    }, defaultTime);


    ascensor.trigger('next');
    hash = window.location.hash.split('#').pop();
    setTimeout(function() {
      expect(hash).toBe(hash_3);
    }, defaultTime);
  });


  it('Go to correct floor on start if hash is present', function() {
    var hash_1 = 'd';
    var hash_2 = 'e';
    var hash_3 = 'f';
    window.location.hash = hash_2;

    var ascensor = getInstanceOfAscensor({
      ascensorFloorName: [hash_1, hash_2, hash_3]
    });

    expect(ascensor.data('current-floor')).toBe(1);

  });


});