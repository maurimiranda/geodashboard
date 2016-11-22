# GeoDashboard

Web library to display data as maps and widgets using **WMS**, **WFS** and **WPS** services.

**GeoDashboard** is a pure client application. That means it doesn't include a backend side. All it needs to work is a map server with WMS, WFS and WPS enabled. At the moment, **GeoDashboard** has been tested only with [GeoServer](http://geoserver.org/).

The idea behind this project is that anybody who already has an OGC compliant server up and running can create a simple and nice dashboard with just a few lines of JavaScript.

**GeoDashboard** born as an inside project of [SIASAR](http://siasar.org).

## How to use it

There are basically two options to use GeoDashboard:
* Downloading or linking the .js and .css files.
* Installing the node package and requiring/importing it in your project.

### Using the files

1. Include GeoDashboard CSS file
```
<link rel="stylesheet" href="https://unpkg.com/geo-dashboard/dist/geo-dashboard.css" />
```
1. Include GeoDashboard JS file
```
<script src="https://unpkg.com/geo-dashboard/dist/geo-dashboard.js"></script>
```

### Using node package

1. Install the package  
```shell
npm install --save geo-dashboard
```
or
```shell
yarn add geo-dashboard
```

1. Require or import the module
```javascript
const GeoDashboard = require('geo-dashboard');
```
or
```javascript
import GeoDashboard from 'geo-dashboard';
```

### Next steps

1. Add a *div* where you wanna display the dashboard
```html
<div id="dashboard"></div>
```

1. Create the dashboard
```javascript
const dashboard = new GeoDashboard.Dashboard({
     container: document.getElementsById('dashboard'),
     header: {
       title: 'GeoDashboard Demo',
     },
     map: {
       center: [-75.01, -9.53],
       zoom: 7,
     }
});
```

1. Add some layers
```javascript
dashboard.addBaseLayer(new GeoDashboard.OSMLayer({
     visible: true,
}));
```
```javascript
dashboard.addOverlayLayer(new GeoDashboard.WFSLayer({
     title: 'Communities',
     server: 'https://geoserver.siasar.org/geoserver',
     layer: 'siasar:communities',
     visible: true,
     popup: [{
       title: 'Name',
       property: 'name',
     }],
     style: {
       property: 'score',
       values: {
         'A': { color: '#54BA46' },
         'B': { color: '#FFFF39' },
         'C': { color: '#FF9326' },
         'D': { color: '#C92429' },
       },
     }
}));
```

1. Add some widgets
```javascript
dashboard.addWidget(new GeoDashboard.CountWidget({
     title: 'Total Communities',
     server: server,
     layer: 'siasar:communities',
}));
```
```javascript
dashboard.addWidget(new GeoDashboard.AggregateWidget({
     title: 'Total Population',
     server: server,
     layer: 'siasar:communities',
     property: 'population',
     function: 'Sum',
}));
```

1. Call the render function and... **that's it!**
```javascript
dashboard.render();
```

### Demo

* Using files:
[Source](https://github.com/maurimiranda/geo-dashboard/blob/master/src/examples/index.js),
[Live](https://maurimiranda.github.io/geo-dashboard/)
* Using node package and webpack:
[Source](https://gitlab.com/Admin_Siasar/SIASAR-Dashboard/tree/master),
[Live](http://dashboard.siasar.org/)
