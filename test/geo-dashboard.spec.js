import chai from 'chai';
import GeoDashboard from '../dist/geo-dashboard';

chai.expect();

const expect = chai.expect;

let dashboard;

describe('Given an instance of GeoDashboard', () => {
  before(() => {
    dashboard = new GeoDashboard();
  });
  it('should be an instance of GeoDashboard', () => {
    expect(dashboard).to.be.an.instanceof(GeoDashboard);
  });
});
