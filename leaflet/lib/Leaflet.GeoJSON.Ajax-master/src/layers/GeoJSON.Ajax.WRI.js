/*
 * Copyright (c) 2016 Dominique Cavailhez
 * https://github.com/Dominique92
 * Supported both on Leaflet V0.7 & V1.0
 *
 * geoJSON layers to access www.refuges.info geographic flows
 */
 
// Europe mountain points of interest
L.GeoJSON.Ajax.WRIpoi = L.GeoJSON.Ajax.extend({
	options: {
		urlGeoJSON: '//www.refuges.info/api/bbox',
		argsGeoJSON: {
			type_points: 'all'
		},
		bbox: true,
		style: function(feature) {
			return {
				iconUrl: '//www.refuges.info/images/icones/' + feature.properties.type.icone + '.png',
				iconAnchor: [8, 8],
				popup: feature.properties.nom,
				url: feature.properties.lien,
				degroup: 12 // Spread the icons when the cursor hover on a busy area.
			};
		}
	}
});

// French mountain limits
L.GeoJSON.Ajax.WRImassifs = L.GeoJSON.Ajax.extend({
	options: {
		urlGeoJSON: '//www.refuges.info/api/polygones',
		argsGeoJSON: {
			type_polygon: 1
		},
		bbox: true,
		style: function(feature) {
			return {
				popup: feature.properties.nom,
				popupValidity: 0,
				url: feature.properties.lien,
				color: feature.properties.couleur,
				weight: 2
			};
		}
	}
});

// http://chemineur.fr
L.GeoJSON.Ajax.chemineur = L.GeoJSON.Ajax.extend({
	options: {
		urlGeoJSON: '//chemineur.fr/ext/Dominique92/GeoBB/gis.php',
		argsGeoJSON: {
			site: 'chemineur,camptocamp,pyrenees-refuges,refuges.info',
			poi: '3,8,16,20,23,28,30,40,44,58,62,64'
		},
		bbox: true
	}
});