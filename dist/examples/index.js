var dashboard = new GeoDashboard({
  serverURL: 'http://geoserver.siasar.org/geoserver',
  header: {
    title: 'GeoDashboard Demo',
    logo: 'https://upload.wikimedia.org/wikipedia/commons/thumb/7/7b/WhiteDot.svg/600px-WhiteDot.svg.png',
  },
  map: {
    bingKey: 'AlMSfR3F4khtlIefjuE_NYpX403LdlGiod36WLn8HlawywtSud-NSgEklCemD5pR',
    center: [-60, -10],
    zoom: 4,
    attribution: '© <a href="http://siasar.org">SIASAR</a>',
    addDefaultBaseLayers: true,
    keepLayerSwitcherOpen: true
  },
});

var options = {
  'A': {
    color: '#54BA46'
  },
  'B': {
    color: '#FFFF39'
  },
  'C': {
    color: '#FF9326'
  },
  'D': {
    color: '#C92429'
  }
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

var communities = dashboard.addWFSLayer({
  title: 'Communities',
  layer: 'siasar:communities',
  exclusive: true,
  visible: true,
  filters: [],
  featurePopup: [{
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
  style: style
});

dashboard.render(document.getElementById('dashboard'));
//
// var providers = dashboard.addWFSLayer({
//   title: 'Prestadores',
//   layer: 'siasar:providers',
//   visible: false,
//   filters: [],
//   featurePopup: [{
//     property: 'name',
//     title: 'Nombre'
//   },{
//     property: 'billing',
//     title: 'Facturación'
//   },{
//     property: 'women',
//     title: 'Mujeres'
//   }],
//   style: style
// });
//
// var systems = dashboard.addWFSLayer({
//   title: 'Sistemas',
//   layer: 'siasar:systems',
//   visible: false,
//   filters: [],
//   featurePopup: [{
//     property: 'name',
//     title: 'Nombre'
//   },{
//     property: 'adm_3',
//     title: 'Distrito'
//   },{
//     property: 'building_date',
//     title: 'Año de construcción',
//     format: function(value) {
//       return new Date(value).getFullYear();
//     }
//   },{
//     property: 'supply_type',
//     title: 'Tipo de suministro'
//   }],
//   style: style
// });
//
// var interpolation = dashboard.addWMSLayer({
//   title: 'Interpolación',
//   layer: 'siasar:communities',
//   style: 'siasar:interpolation',
//   exclusive: true,
//   visible: false
// });
//
// var heatmap = dashboard.addWMSLayer({
//   title: 'Heatmap',
//   layer: 'siasar:communities',
//   style: 'siasar:heatmap',
//   exclusive: true,
//   visible: false
// });
//
// var cluster = dashboard.addWMSLayer({
//   title: 'Cluster',
//   layer: 'siasar:communities',
//   style: 'siasar:cluster',
//   exclusive: true,
//   visible: false
// });
//
//
// dashboard.addWidget(new FilterWidget({
//   layer: communities,
//   filteredLayers: [communities, heatmap, cluster],
//   property: 'score',
//   title: 'Calificación',
//   options: options
// }));
//
// dashboard.addWidget(new CountWidget({
//   layer: communities,
//   title: 'Comunidades'
// }));
//
// dashboard.addWidget(new CountWidget({
//   layer: systems,
//   title: 'Sistemas'
// }));
//
// dashboard.addWidget(new CountWidget({
//   layer: providers,
//   title: 'Prestadores'
// }));
//
// dashboard.addWidget(new AggregateWidget({
//   layer: communities,
//   property: 'population',
//   function: 'Sum',
//   title: 'Habitantes'
// }));
//
// dashboard.addWidget(new AggregateWidget({
//   layer: communities,
//   property: 'housing',
//   function: 'Sum',
//   title: 'Hogares'
// }));
