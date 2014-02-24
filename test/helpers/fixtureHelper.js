if (typeof window.__karma__ !== 'undefined') {
  jasmine.getFixtures().fixturesPath = 'base/test/fixtures/';
} else {
  jasmine.getFixtures().fixturesPath = './fixtures/';
}