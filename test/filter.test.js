/* eslint-disable max-len */

import * as GeoDashboard from '../dist/geo-dashboard';

test('Filter', () => {
  expect(new GeoDashboard.Filter({
    property: 'the_property',
    value: 'the_value',
  })).toBeInstanceOf(GeoDashboard.Filter);
});

describe('Simple Filter', () => {
  test('Filter String', () => {
    const filter = new GeoDashboard.Filter({
      property: 'the_property',
      value: 'the_value',
    });
    expect(filter.toString()).toBe("(the_property='the_value')");
  });
});

describe('Complex Filter', () => {
  test('Filter String', () => {
    const filter = new GeoDashboard.Filter({
      property: [new GeoDashboard.Filter({
        property: 'first_property',
        value: 'first_value',
      }), new GeoDashboard.Filter({
        property: 'second_property',
        value: 'second_value',
        logicalOperator: 'OR',
      })],
    });
    expect(filter.toString()).toBe("((first_property='first_value') OR (second_property='second_value'))");
  });
});

describe('Dashboard Filters', () => {
  test('Filter String', () => {
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
          })],
          logicalOperator: 'OR',
        }),
      ],
    });
    expect(dashboard.filterString).toBe("(the_property='the_value') OR ((first_property='first_value') AND (second_property='second_value'))");
  });
});
