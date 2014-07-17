/*
This file is part of Storm Surge & Sea Level Rise
Copyright 2014 RPS ASA
All rights reserved.
*/
var assetLayerGroup = new L.LayerGroup();

var map = L.map('map',{
				center:[41.624091, -70.908548],
				zoom: 12,
				maxZoom: 15,
				minZoom: 10
			});

var locationIcon_working = L.AwesomeMarkers.icon({icon: 'spinner', prefix: 'fa', markerColor: 'red', spin:true});
var locationIcon_ok = L.AwesomeMarkers.icon({icon: 'check', prefix: 'fa', markerColor: 'green', spin:false});
var locationIcon_error = L.AwesomeMarkers.icon({icon: 'exclamation', prefix: 'fa', markerColor: 'purple', spin:false});

var locationMarker = L.marker([41.624091,-70.908548], {
	icon: locationIcon_working,
	draggable: true
	}
	).addTo(map);


var osmUrl='http://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
	osmAttrib='Map data &copy; OpenStreetMap contributors',
	osm = new L.TileLayer( osmUrl, {attribution: osmAttrib});

map.addLayer(osm);

//load the default options
geojson = './shp/80mb_4ft.shp.geojson '
$.getJSON(geojson, function(data) {
	var geojson = L.geoJson(data, {
	  onEachFeature: function (feature, layer) {
	    //layer.bindPopup(feature.properties.name);
	  }
	});
	//geojson.bindPopup("<b>Affected Areas in Blue</b><br>Pressure Val: "+40+" mb<br>Sea Level Rise: "+2 + " ft");
	assetLayerGroup.addLayer(geojson)

	assetLayerGroup.addTo(map);

	});

