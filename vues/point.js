<?// Script lié à la page point

// Ce fichier ne doit contenir que du code javascript destiné à être inclus dans la page
// $modele contient les données passées par le fichier PHP
// $config les données communes à tout WRI

// 19/10/11 Sly : Invention des "templates" js
// 23/10/11 Dominique : Retour ici du code spécifique à la page qui avait été mis dans la bibliothèque
// 15/04/11 Dominique : Passage en OL2.11
// 26/06/12  Dominique : Introduction des traductions de coordonnées
?>
var map; // L'objet de gestion de la carte

window.onload = function () {
	// Initialise le convertisseur de projections
/*
	var displayPosition = new OpenLayers.Position ({
		position: new OpenLayers.LonLat (<?=$modele->longitude?>, <?=$modele->latitude?>)
	});
*/
	
	// Crée la carte
	map = new OpenLayers.Map ('vignette', {
		displayProjection: 'EPSG:4326', // Pour le permalink et les cookies en degminsec,
		controls: [
			new OpenLayers.Control.PanZoom (),
			new OpenLayers.Control.PermalinkCookies (null, null, {
				force: {
					lon: <?=$modele->longitude?>,
					lat: <?=$modele->latitude?>,
					scale: <?=$modele->vignette[3]?>,
					baseLayer: '<?=$modele->vignette[0]?>'
				}
			}),
			new OpenLayers.Control.LayerSwitcherConditional (),
			new OpenLayers.Control.ScaleLine ({geodesic: true}), // L'échelle n'est pas la bonne pour les projections de type mercator. En effet, dans cette projection, le rapport nombre pixel/distance réél augmente quand on se rapproche des pôles.Pour corriger ça, un simple geodesic:yes fais l'affaire (SLY 29/11/2010)
			new OpenLayers.Control.Navigation (),
			new OpenLayers.Control.FullScreenPanel(),
			new OpenLayers.Control.Attribution ()
		],
		layers: [
			new OpenLayers.Layer.Google.Terrain ('Google'),
			new OpenLayers.Layer.Google         ('Google map',   {visibility: false}), // Cachée au début sinon, apparait fugitivement
			new OpenLayers.Layer.Google.Photo   ('Google photo', {visibility: false}), // Cachée au début sinon, apparait fugitivement
			new OpenLayers.Layer.OSM            ('OSM'),
			new OpenLayers.Layer.WRI            ('maps.refuges.info'),
			new OpenLayers.Layer.Velo           ('OpenCycleMap'),
			new OpenLayers.Layer.IGN            ('IGN', '<?=$config["ign_key"]?>'),
			new OpenLayers.Layer.SwissTopo      ('SwissTopo'),
			new OpenLayers.Layer.IGM            ('Italie'),
			new OpenLayers.Layer.IDEE           ('Espagne')
		]
	});
	// Les overlays (une fois que la carte est initialisée
	map.addLayers ([
		new OpenLayers.Layer.ImgPosition    ('Cadre', {
			img: OpenLayers._getScriptLocation() + 'img/cadre.png', h: 43, l: 31, 
			pos: map.getCenter (), 
			displayInLayerSwitcher: false
		}),
		new OpenLayers.Layer.GMLSLD         ('WRI', {	
			urlGML: '/exportations/exportations.php?format=gml&icones=50',
			projection: 'EPSG:4326',
			urlSLD: OpenLayers._getScriptLocation() + 'refuges-info-sld.xml',
			styleName: 'Points',
			visibility: true, 
			displayInLayerSwitcher: false
		})
	]);
/*
	// inclure le cadre aprés la création de la carte car la position est maintenant définie.
	// Ne pas le mettre dans addLayersListened car le cadre n'est pas déplaçable
	map.addLayers ([
	]);
	// TODO Bon, là, c'est super redondant: mais il y avait un gros bug / Dominique 2012/09/12
	map.setCenter (
		new OpenLayers.LonLat (<?=$modele->longitude?>, <?=$modele->latitude?>)
			.transform (map.displayProjection, map.getProjectionObject())
	);
*/
}

// Actions de la page
function agrandir_vignette () {
	// On masque le contrôle puisqu'il a déjà été activé
	var agrandir_vignette = document.getElementById('agrandir_vignette');
	if (agrandir_vignette)
		agrandir_vignette.style.display = 'none';
		
	// On positionne la couche de second choix
	var layers_alternate = map.getLayersByName ('<?=$modele->vignette[2]?>');
	if (layers_alternate.length)
		map.setBaseLayer (layers_alternate [0]);
	
	// On redimentionne
	map.div.style.width  =
	map.div.style.height = '400px';
	map.updateSize(); // Because mozilla wont let us catch the "onresize" for an element
	
	var agrandir = document.getElementById('agrandir');
	if (agrandir)
		agrandir.style.display = 'none';
}