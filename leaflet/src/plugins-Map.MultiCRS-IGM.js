/*
 * Copyright (c) 2014 Dominique Cavailhez
 * Italian maps
 * Instance of the WMS class allow viewing maps of IGM (Istituto Geografico Militare) Geoportale Nazionale
 * (c) http://www.pcn.minambiente.it
 */

L.TileLayer.WMS.IGM = L.TileLayer.WMS.extend({

	initialize: function() {
		L.TileLayer.WMS.prototype.initialize.call(this,
			'http://129.206.228.72/cached/osm?', { // Pour les grands zooms, il n'y a pas de carte IGM, donc on prend une carte OSM au m�me format WMS
				crs: L.CRS.EPSG900913,
				tileSize: 512 // Moins de filigranes
			}
		);
	},

	onAdd: function(map) {
		L.TileLayer.WMS.prototype.onAdd.call(this, map);
		map.on('zoomend', this.onZoom, this); // On ajoute une action sur chaque changement de zoom
		this.onZoom(); // Et, pour bien commencer, on l'ex�cute au d�marrage
	},

	onZoom: function() {
		// Il y a 3 sources de cartes IGM pour des d�finitions bien pr�cises
		var np = {
			url: 'http://wms.pcn.minambiente.it/ogc?map=/ms_ogc/WMS_v1.3/raster/',
			urlExt: '',
			attribution: '&copy; <a href="http://www.pcn.minambiente.it/viewer">IGM</a>'
		};
		if (this._map._zoom < 11) {
			np.url = 'http://129.206.228.72/cached/osm?';
			np.layers = 'osm_auto:all';
			np.attribution = '&copy; <a href="http://www.osm-wms.de/">OSM</a>'
		} else if (this._map._zoom < 13) {
			np.urlExt = 'IGM_250000.map';
			np.layers = 'CB.IGM250000';
		} else if (this._map._zoom < 15) {
			np.urlExt = 'IGM_100000.map';
			np.layers = 'MB.IGM100000';
		} else if (this._map._zoom < 16) {
			np.urlExt = 'IGM_25000.map';
			np.layers = 'CB.IGM25000';
		}

		// Si les param�tres ont chang�
		if (this.wmsParams.layers != np.layers) {
			// On r�initialise les param�tres et on recharge la couche
			this._url = np.url + np.urlExt;
			this.wmsParams.layers = np.layers;
			this.redraw();

			// Sans oublier l'attribution
			this.options.attribution = np.attribution;
			this._map.attributionControl._attributions = [];
			this._map.attributionControl.addAttribution(np.attribution);
		}
	}
});