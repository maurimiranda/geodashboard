/* eslint-disable max-len */

import * as GeoDashboard from '../dist/geo-dashboard';

test('WFSLayer', () => {
  expect(new GeoDashboard.WFSLayer()).toBeInstanceOf(GeoDashboard.WFSLayer);
});

test('CQL Filter', () => {
  const dashboard = new GeoDashboard.Dashboard({
    container: document.body,
    filters: [
      new GeoDashboard.Filter({
        property: 'the_property',
        value: 'the_value',
      }),
      new GeoDashboard.Filter({
        property: [new GeoDashboard.Filter({
          property: 'first_property',
          value: 'first_value',
        }), new GeoDashboard.Filter({
          property: 'second_property',
          value: 'second_value',
          logicalOperator: 'OR',
        })],
      }),
    ],
  });
  const wfsLayer = new GeoDashboard.WFSLayer();
  dashboard.addOverlayLayer(wfsLayer);
  expect(wfsLayer.buildCQLFilter([0, 0, 0, 0])).toBe("bbox(geom, 0,0,0,0, 'EPSG:3857') AND (the_property='the_value') AND ((first_property='first_value') OR (second_property='second_value'))");
});
