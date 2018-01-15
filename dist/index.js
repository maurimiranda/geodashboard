const server = 'https://geoserver.threefunkymonkeys.com';

const namespace = {
  name: 'gd',
  url: 'http://geodashboard.org'
};

const attribution = 'Data provided by <a href="https://www.properati.com.ar">Properati</a>';

const property_type = {
  property: 'property_type',
  values: {
    'apartment': { color: '#1f78b4' },
    'house': { color: '#a6cee3' },
    'PH': { color: '#02818a' },
    'store': { color: '#41ab5d' },
  },
}

const category = {
  property: 'category',
  values: {
    'A': { color: '#a63603' },
    'B': { color: '#e6550d' },
    'C': { color: '#fd8d3c' },
    'D': { color: '#fdbe85' },
  },
}

function formatMoney(value) {
  return `$${parseInt(value).toLocaleString()}`;
}

function formatSurface(value) {
  return `${parseInt(value).toLocaleString()}m<sup>2</sup>`;
}

const dashboard = new GeoDashboard.Dashboard({
  container: document.getElementsByClassName('container')[0],
  map: {
    center: [-58.40, -34.61],
    zoom: 14,
  },
  filters: [new GeoDashboard.Filter({
    property: 'surface_total_in_m2',
    operator: '>',
    value: '0'
  })],
});

dashboard.addBaseLayer(new GeoDashboard.OSMLayer({
  visible: true,
}));
dashboard.addBaseLayer(new GeoDashboard.BingLayer({
  key: 'AlMSfR3F4khtlIefjuE_NYpX403LdlGiod36WLn8HlawywtSud-NSgEklCemD5pR',
}));

dashboard.addOverlayLayer(new GeoDashboard.WMSLayer({
  title: 'Properties by Type (WMS)',
  server: server,
  layer: `${namespace.name}:properati`,
  style: `${namespace.name}:properati_property_type`,
  visible: true,
  exclusive: true,
  useCache: true,
  tiled: true,
  attribution: attribution,
}));

dashboard.addOverlayLayer(new GeoDashboard.MVTLayer({
  title: 'Properties by Category (MVT)',
  server: server,
  layer: `${namespace.name}:properati`,
  exclusive: true,
  popup: [{
    property: 'image_thumbnail',
    format: (value) => {
      if (!value) return null;
      return `<a target="_blank" href="${value}"><img src="${value}"/></a>`;
    },
  }, {
    title: 'Place Name',
    property: 'place_name',
  }, {
    title: 'Rooms',
    property: 'rooms',
  }, {
    title: 'Surface (Total / Covered)',
    property: ['surface_total_in_m2', 'surface_covered_in_m2'],
    format: (total, covered) => `${formatSurface(total)} / ${formatSurface(covered)}`,
  }, {
    title: 'Price',
    property: 'price_aprox_usd',
    format: formatMoney,
  }, {
    property: 'properati_url',
    format: (value) => {
      if (!value) return null;
      return `<a style="width:100%;display:block;text-align:right;font-size:1.3em;text-decoration:none;" target="_blank" href="${value}">ℹ️</a>`;
    },
  }],
  style: category,
  attribution: attribution,
}));

dashboard.addOverlayLayer(new GeoDashboard.WFSLayer({
  title: 'Heatmap (WFS)',
  server: server,
  layer: `${namespace.name}:properati`,
  exclusive: true,
  heatmap: true,
  attribution: attribution,
  opacity: 0.6,
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Average Price',
  server: server,
  namespace: namespace,
  layer: `${namespace.name}:properati`,
  property: 'price_aprox_usd',
  function: 'Average',
  format: formatMoney,
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Average Total Surface',
  server: server,
  namespace: namespace,
  layer: `${namespace.name}:properati`,
  property: 'surface_total_in_m2',
  function: 'Average',
  format: formatSurface,
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Max Price',
  server: server,
  namespace: namespace,
  layer: `${namespace.name}:properati`,
  property: 'price_aprox_usd',
  function: 'Max',
  format: formatMoney,
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Max Total Surface',
  server: server,
  namespace: namespace,
  layer: `${namespace.name}:properati`,
  property: 'surface_total_in_m2',
  function: 'Max',
  format: formatSurface,
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Min Price',
  server: server,
  namespace: namespace,
  layer: `${namespace.name}:properati`,
  property: 'price_aprox_usd',
  function: 'Min',
  format: formatMoney,
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Min Total Surface',
  server: server,
  namespace: namespace,
  layer: `${namespace.name}:properati`,
  property: 'surface_total_in_m2',
  function: 'Min',
  format: formatSurface,
}));

dashboard.addWidget(new GeoDashboard.CategoryWidget({
  title: 'Properties by Type',
  server: server,
  namespace: namespace,
  layer: `${namespace.name}:properati`,
  property: 'property_type',
  categories: property_type,
}));

dashboard.addWidget(new GeoDashboard.CategoryWidget({
  title: 'Properties by Category',
  server: server,
  namespace: namespace,
  layer: `${namespace.name}:properati`,
  property: 'category',
  categories: category,
}));

dashboard.addWidget(new GeoDashboard.ChartWidget({
  title: 'Properties by Type',
  server: server,
  namespace: namespace,
  layer: `${namespace.name}:properati`,
  property: 'property_type',
  categories: property_type,
  chart: {
    type: 'bar',
  },
}));

dashboard.addWidget(new GeoDashboard.ChartWidget({
  title: 'Properties by Category (%)',
  server: server,
  namespace: namespace,
  layer: `${namespace.name}:properati`,
  property: 'category',
  categories: category,
  chart: {
    type: 'doughnut',
  },
}));

dashboard.render();
