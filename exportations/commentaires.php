<?php
// Exporte les donn�es des commentaires (pour usage dans Chemineur)
// Format barbare et purement prori�taire Chemineur

require_once ("../includes/config.php");
require_once ("fonctions_exportations.php");

$query = "SELECT * FROM commentaires";

if (!($res = $pdo->query ($query))) 
    return erreur("Une erreur sur la requete est survenue",$query);

while ($point = $res->fetch())
	foreach ($point AS $k => $v)
		echo "@@@$k=$v";
echo "@@@<br>\n";
?>