// Create main dashboard object
var server = 'http://geoserver.siasar.org/geoserver';

var dashboard = new GeoDashboard.Dashboard({
  container: document.getElementById('dashboard'),
  header: {
    title: 'GeoDashboard Demo',
    logo: 'https://i.imgur.com/WlTv6mO.png',
  },
  map: {
    center: [-60, -10],
    zoom: 4,
  },
});

dashboard.addBaseLayer(new GeoDashboard.BingLayer({
  key: 'AlMSfR3F4khtlIefjuE_NYpX403LdlGiod36WLn8HlawywtSud-NSgEklCemD5pR',
}));
dashboard.addBaseLayer(new GeoDashboard.OSMLayer());

var options = {
  'A': { color: '#54BA46' },
  'B': { color: '#FFFF39' },
  'C': { color: '#FF9326' },
  'D': { color: '#C92429' }
};

var style = {
  label: {
    property: 'name'
  },
  color: {
    property: 'score',
    values: options
  }
};

var communities = new GeoDashboard.WFSLayer({
  title: 'Communities',
  server: server,
  layer: 'siasar:communities',
  exclusive: true,
  visible: true,
  filters: [],
  popup: [{
    title: 'Name',
    property: 'name',
  },{
    title: 'Location',
    property: 'adm_3',
  },{
    title: 'Population',
    property: 'population',
  },{
    title: 'Housing',
    property: 'housing',
  }],
  style: style,
  attribution: '© <a href="http://siasar.org">SIASAR</a>',
});

var heatmap = new GeoDashboard.WMSLayer({
  title: 'Heatmap',
  server: server,
  layer: 'siasar:communities',
  style: 'siasar:heatmap',
  exclusive: true,
  visible: false
});

dashboard.addOverlayLayer(heatmap);
dashboard.addOverlayLayer(communities);

dashboard.addWidget(new GeoDashboard.CountWidget({
  title: 'Communities',
  server: server,
  layer: 'siasar:communities',
}));

dashboard.addWidget(new GeoDashboard.AggregateWidget({
  title: 'Population',
  server: server,
  layer: 'siasar:communities',
  property: 'population',
  function: 'Sum',
}));

dashboard.render();
