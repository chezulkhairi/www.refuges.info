<?php
/**********************************************************************************************
Page de modification d'un point
sly 26/11/2012 : FIXME à basculer sur le système des modèles (=séparation traitement/HTML)
jmb 16/02/13 : un peu de re ecriture du bazar avec des gros Switch

3 cas pour arriver ici, toujours depuis point_formulaire_modification:
-Creation d'un point
-Modification d'un point
-suppression d'un point
**********************************************************************************************/

require_once ("fonctions_points.php");
require_once ("fonctions_autoconnexion.php");

// Je ne sais pas dans quel fichier mettre cette fonction, elle ne sert que à la saisie d'un point et uniquement ici en gros
function preparation_point()
{
    // on rempli l'object $point à mettre à jour/ajouter en fonction des paramètres POST
    // si l'id_point peut être vide, cela indiquera une création 
    // ATTENTION BIDOULLE si on fait attention à ce que le nom des champs correspondent, on gagne du temps avec :
    // Il y aura bien quelques trucs en trop, mais la fonction modification ne s'en servira pas
    $point = new stdClass;
    foreach ($_REQUEST as $nom => $value)
        $point->$nom=stripslashes(trim($value));
    
    // crade, mais trop de retard. verrai ca plus tard.
    if ( !is_numeric($point->places_matelas) && $point->places_matelas != "NULL" )
        $point->places_matelas = "0" ; // bug : cast d'une string vers 0
    return $point;
}  
function gestion_retour($retour,$vue)
{
    if ($retour->erreur) 
        $vue->erreur=$retour->message;
    else
    {
        $retourid = $retour; // id du point modifié/supprimé
        $vue->lien_point=lien_point_lent($retourid);
    } 
}  
switch( $_REQUEST["action"] )
{
    case 'Ajouter' :
        // Etant donné que des robots, ou des peu scrupuleux remplissent avec des faux points, on les vire ici
        if ( !isset($_SESSION['id_utilisateur']) AND ($_REQUEST['lettre_securite']!="d") ) 
        {
            $vue->erreur = "ERREUR: vous n'avez pas rentré la lettre demandée";
            break; // on sort, on ne passe pas à "modifier" qui est l'action groupée
        }
        $point=preparation_point();
        $retour = modification_ajout_point($point);
        gestion_retour($retour,$vue);
        //FIXME sly: y'a peut-être mieux à faire que "back du navigateur" en re-proposant le formulaire avec le champs en erreur surligné en rouge
        if ($vue->erreur)
            $vue->erreur.=" <br />(Vous pouvez retourner corriger le problème en utilisant le bouton retour de votre navigateur)";
        else
            $vue->message="Le point a bien été ajouté";
        break;
    case 'Modifier' :
        $ancien_point=infos_point($_REQUEST['id_point'],True); // Uniquement pour récupérer l'id_createur car tout le reste est dans $_REQUEST
        $nouveau_point=preparation_point();
        // modification uniquement si modérateur ou créateur de la fiche
        if ( $_SESSION['niveau_moderation']>=1 
              or 
              (isset($_SESSION['id_utilisateur']) and $_SESSION['id_utilisateur']==$ancien_point->id_createur )
           )
        {
            $retour = modification_ajout_point($nouveau_point);
            gestion_retour($retour,$vue);
            $vue->message="Le point a bien été modifié";
        }
        else
            $vue->erreur="Vous n'êtes ni modérateur, ni créateur de la fiche, vous n'avez pas l'autorisation de la modifier";
        break;
    
    case 'supprimer':
            $point=infos_point($_REQUEST['id_point'],True);
            $resultat_suppression=suppression_point($point);
            if ($resultat_suppression->erreur)
                $vue->erreur=$resultat_suppression->message;
            else
                $vue->message=$resultat_suppression->message; // Il pourra y avoir des messages sur mesures (genre "le point a été supprimé mais il n'y avait pas de commentaires")
            break;
} 

?>  
