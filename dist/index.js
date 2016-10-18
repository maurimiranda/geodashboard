/* eslint-disable */

var dashboard = new GeoDashboard();
console.log(dashboard);

// var dashboard = new GeoDashboard({
//   title: 'SIASAR Dashboard',
//   logoUrl: '/images/iso_siasar_blanco.png',
//   geoserverUrl: appConfig.geoserverUrl,
//   container: $('.dashboard'),
//   center: [-60, -10],
//   zoom: 4,
//   attribution: '© <a href="http://siasar.org">SIASAR</a>',
//   addDefaultBaseLayers: true,
//   keepLayerSwitcherOpen: true
// });
//
// var options = {
//   'A': {
//     color: '#54BA46'
//   },
//   'B': {
//     color: '#FFFF39'
//   },
//   'C': {
//     color: '#FF9326'
//   },
//   'D': {
//     color: '#C92429'
//   }
// };
//
// var style = {
//   label: {
//     property: 'name'
//   },
//   color: {
//     property: 'score',
//     values: options
//   }
// };
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
// var communities = dashboard.addWFSLayer({
//   title: 'Comunidades',
//   layer: 'siasar:communities',
//   exclusive: true,
//   visible: true,
//   filters: [],
//   featurePopup: [{
//     property: 'name',
//     title: 'Nombre'
//   },{
//     property: 'adm_3',
//     title: 'Distrito'
//   },{
//     property: 'population',
//     title: 'Habitantes'
//   },{
//     property: 'housing',
//     title: 'Hogares'
//   },{
//     property: 'issa',
//     title: 'ISSA'
//   }],
//   style: style
// });
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
