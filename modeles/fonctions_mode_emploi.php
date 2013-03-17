<?php 
/********************************************************************
Fonctions liées au mode d'emploi du site
Accés aux données : entrées / sorties / modifications des textes
fonction qui va chercher le texte du fichier correspondant à la page 
FIXME : c'était une mauvaise idée de passer par des fichiers : les datas texte c'est 
FIXME : très bien dans la base de donnée, à convertir dès qu'un peu de temps
********************************************************************/

require_once ('config.php');
require_once ("fonctions_mise_en_forme_texte.php");
require_once ("fonctions_bdd.php");

// Fonction pour réaliser un lien vers une page du mode d'emploi 
function lien_mode_emploi($page="index")
{
    global $config;
    $base=$config['base_mode_emploi'];
    if ($page=="")
        return $base;
    return $base.strtolower($page)."/";
}

function recupere_contenu($page)
{
    global $config,$pdo;
    $page=$pdo->quote($page);
    $query="SELECT *,extract('epoch' from date) as ts_unix_page
              FROM pages_wiki 
              WHERE nom_page=$page order by date desc limit 1";
    $res=$pdo->query($query);
    if (!$res)
        return erreur("Requête SQL impossible à executer",$query);
    
    $page=$res->fetch();
    if (!$page)
        return erreur("Cette page du wiki n'existe pas");
    // gestion des liens internes au format [url=##page]c'est là que ça se passe[/url]
    $page->contenu_html=str_replace("##",lien_mode_emploi(""),$page->contenu);
    // conversion bbcode
    $page->contenu_html=trim(bbcode2html($page->contenu_html,TRUE));
    return $page;
}

// fonction qui va ré-écrire le contenu de la page
function ecrire_contenu($page,$contenu)
{
	global $config,$pdo;
    $page=$pdo->quote($page);
    $contenu=$pdo->quote($contenu);
    $query="insert into pages_wiki (nom_page,contenu) VALUES ($page,$contenu)";
    $res=$pdo->query($query);
    if (!$res)
        return erreur("Requête SQL impossible à executer",$query);
   
    return ok("Page mise à jour, et ancienne verson conservée");
}

// Supprime la page et toute ses anciennes versions
function supprimer_page($page)
{
    global $config,$pdo;
    $page=$pdo->quote($page);
    $query="delete from pages_wiki where page='$page'";
    $res=$pdo->query($query);
    if (!$res)
        return erreur("Requête SQL impossible à executer",$query);
    
    return ok("Page supprimée et tout ses anciennes versions");
}

?>
