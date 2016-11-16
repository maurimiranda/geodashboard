var server = 'https://geoserver.siasar.org/geoserver';
var categories = {
  property: 'score',
  values: {
    'A': { color: '#54BA46' },
    'B': { color: '#FFFF39' },
    'C': { color: '#FF9326' },
    'D': { color: '#C92429' },
  },
};
var style = {
  label: {
    property: 'name'
  },
  color: categories,
};

var dashboard = new GeoDashboard.Dashboard({
  container: document.getElementsByClassName('dashboard')[0],
  header: {
    title: 'GeoDashboard Demo',
    logo: './geo-dashboard-white.png',
  },
  map: {
    center: [-75.01, -9.53],
    zoom: 7,
  },
  filters: [{
    property: 'adm_0',
    value: 'PERÚ'
  }],
});

dashboard.addBaseLayer(new GeoDashboard.BingLayer({
key: 'AlMSfR3F4khtlIefjuE_NYpX403LdlGiod36WLn8HlawywtSud-NSgEklCemD5pR',
}));
dashboard.addBaseLayer(new GeoDashboard.OSMLayer());

dashboard.addOverlayLayer(new GeoDashboard.WMSLayer({
  title: 'Heatmap',
  server: server,
  layer: 'siasar:communities',
  style: 'siasar:heatmap',
  exclusive: true,
  visible: false
}));

dashboard.addOverlayLayer(new GeoDashboard.WFSLayer({
  title: 'Communities',
  server: server,
  layer: 'siasar:communities',
  exclusive: true,
  visible: true,
  popup: [{
    title: 'Name',
    property: 'name',
  },{
    title: 'Location',
    property: 'adm_3',
  },{
    title: 'Population',
    property: 'population',
  }],
  style: style
}));

dashboard.addWidget(new GeoDashboard.CountWidget({
  title: 'Total Communities',
  server: server,
  layer: 'siasar:communities',
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Total Population',
  server: server,
  layer: 'siasar:communities',
  property: 'population',
  function: 'Sum',
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Average Population',
  server: server,
  layer: 'siasar:communities',
  property: 'population',
  function: 'Average',
  format: function(value) {
    return parseFloat(value).toFixed(2);
  },
}));

dashboard.addWidget(new GeoDashboard.GroupWidget({
  title: 'Communities by Category',
  server: server,
  layer: 'siasar:communities',
  property: 'id',
  categories: categories,
}));

dashboard.addWidget(new GeoDashboard.ChartWidget({
  title: 'Communities Chart',
  server: server,
  layer: 'siasar:communities',
  property: 'id',
  categories: categories,
}));

dashboard.render();
