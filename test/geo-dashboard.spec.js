import chai from 'chai';
import * as GeoDashboard from '../dist/geo-dashboard';

chai.expect();

const expect = chai.expect;

let dashboard;

describe('Given an instance of Dashboard', () => {
  before(() => {
    dashboard = new GeoDashboard.Dashboard();
  });
  it('should be an instance of Dashboard', () => {
    expect(dashboard).to.be.an.instanceof(GeoDashboard.Dashboard);
  });
});
