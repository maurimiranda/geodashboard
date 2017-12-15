server = 'http://threefunkymonkeys.com:8080/geoserver';
namespace = {
  name: 'geodashboard',
  url: 'http://geodashboard.org'
};

const property_type = {
  property: 'property_type',
  values: {
    'apartment': { color: '#1f78b4' },
    'house': { color: '#b2df8a' },
    'PH': { color: '#a6cee3' },
    'store': { color: '#33a02c' },
  },
}

const dashboard = new GeoDashboard.Dashboard({
  container: document.getElementsByClassName('dashboard')[0],
  header: {
    title: 'GeoDashboard Demo',
    logo: './geo-dashboard-white.png',
  },
  map: {
    center: [-58.40, -34.60],
    zoom: 14,
  },
  // filters: [new GeoDashboard.Filter({
  //   property: 'state_name',
  //   value: 'Mendoza'
  // })],
});

dashboard.addBaseLayer(new GeoDashboard.OSMLayer({
  visible: true,
}));
dashboard.addBaseLayer(new GeoDashboard.BingLayer({
  key: 'AlMSfR3F4khtlIefjuE_NYpX403LdlGiod36WLn8HlawywtSud-NSgEklCemD5pR',
}));

dashboard.addOverlayLayer(new GeoDashboard.WFSLayer({
  title: 'Properties',
  server: server,
  layer: 'geodashboard:properati',
  exclusive: true,
  visible: true,
  popup: [{
    property: 'image_thumbnail',
    format: (value) => {
      if (!value) return null;
      return `<a target="_blank" href="${value}"><img src="${value}"/></a>`;
    },
  },{
    title: 'State',
    property: 'state_name',
  },{
    title: 'Place Name',
    property: 'place_name',
  },{
    title: 'Rooms',
    property: 'rooms',
  }, {
    title: 'Price',
    property: 'price',
  },{
    property: 'properati_url',
    format: (value) => {
      if (!value) return null;
      return `<a style="width:100%;display:block;text-align:right;font-size:1.3em;text-decoration:none;" target="_blank" href="${value}">ℹ️</a>`;
    },
  }],
  style: property_type,
  attribution: 'Datos provistos por <a href="https://www.properati.com.ar">Properati</a>',
}));

dashboard.addOverlayLayer(new GeoDashboard.WMSLayer({
  title: 'Heatmap',
  server: server,
  layer: 'geodashboard:properati',
  style: 'geodashboard:heatmap',
  exclusive: true,
  attribution: 'Datos provistos por <a href="https://www.properati.com.ar">Properati</a>',
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Average Price',
  server: server,
  namespace: namespace,
  layer: 'geodashboard:properati',
  property: 'price_aprox_usd',
  function: 'Average',
  format: function(value) {
    return `$${parseInt(value)}`;
  },
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Average Surface',
  server: server,
  namespace: namespace,
  layer: 'geodashboard:properati',
  property: 'surface_total_in_m2',
  function: 'Average',
  format: function (value) {
    return `${parseInt(value)} m2`;
  },
}));

dashboard.addWidget(new GeoDashboard.ChartWidget({
  title: 'Properties by Type',
  server: server,
  namespace: namespace,
  layer: 'geodashboard:properati',
  property: 'property_type',
  categories: property_type,
  chart: {
    type: 'bar',
  },
}));

dashboard.addWidget(new GeoDashboard.ChartWidget({
  title: 'Properties by Type (%)',
  server: server,
  namespace: namespace,
  layer: 'geodashboard:properati',
  property: 'property_type',
  categories: property_type,
  chart: {
    type: 'doughnut',
  },
}));

dashboard.addWidget(new GeoDashboard.CategoryWidget({
  title: 'Properties by Type',
  server: server,
  namespace: namespace,
  layer: 'geodashboard:properati',
  property: 'property_type',
  categories: property_type,
}));

dashboard.render();
