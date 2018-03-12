import * as GeoDashboard from '../dist/geo-dashboard';

test('GeoDashboard', () => {
  expect(new GeoDashboard.Dashboard({
    container: document.body,
  })).toBeInstanceOf(GeoDashboard.Dashboard);
});
