// Variables globales
var mot_a_deviner = "ELEPHANT";
var lettres_utilisees = "ET";
var score = 0;
var nb_erreurs_permises = 6;
var jeu_en_cours = false;
var zone_score;
var zone_erreurs;
var zone_mot;
var zone_essais;

//-----
// 1.1., 1.4., 1.5.
//------
function init()
{
	// Initialisation des variables globales correspondant aux zones
	zone_erreurs = document.getElementById("zone_erreurs");
	zone_essais = document.getElementById("zone_essais");
	zone_mot = document.getElementById("zone_mot");
	zone_score = document.getElementById("zone_score");
	// ...


	
	document.getElementById("GO").setAttribute('onclick', 'nouvelle_partie()');

	// Réinitialisation de l'interface (pour être prêt à relancer une partie)
	reinit();

	// Association de clic_lettre au clic sur les lettres
	var lettre = document.getElementsByClassName("lettre");
	for(var val of lettre){
		val.setAttribute("onclick","clic_lettre(this)");
	}
	
	// ...
}


//---------
// 1.2. et 1.7.
//----------
function reinit()
{
	jeu_en_cours = false;
	zone_mot.value = "----- Jeu du Pendu -----";
	zone_essais.value = "Cliquez sur GO pour jouer";
	zone_erreurs.value = nb_erreurs_permises;
	zone_erreurs.style.background = 'white';

}



//--------------------------------------------
// 1.3.
// Fonction prenant en paramètres :
//	=> lettres : une chaine de caractères
// => mot : une chaine de caractères
// 
// et retournant une chaine de caractères correspondant à mot dans lequel :
// - les lettres non présentes dans lettres sont remplacées par des "_"
// - les lettres apparaissant dans lettres apparaissent en clair
//--------------------------------------------
function mot_complete(lettres, mot)
{
	zone_mot.value = "";
	var nb = 0;
	for(var val of mot){
		if(lettres.indexOf(val) != -1){
			zone_mot.value += val;
		}else{
			zone_mot.value +="_";
		}
		/*for(var let of lettres){

			if(val == let ){
				
				zone_mot.value += let;
			}else{
				nb++;
			}
			if(nb == lettres.length){
				zone_mot.value +="_";
			}
		}
		nb =0;*/
	
	}
	return zone_mot.value;
}


function maj_zone_mot()
{
		var s = mot_complete(lettres_utilisees, mot_a_deviner);
		zone_mot.value = s;
}

// 1.6.
function inclus(mot, lettres)
{
	var nb = 0;
	for(var m of mot){
		for(var let of lettres){
			if(let == m){
				nb++;
			}
		}
	}

	if(mot.length == nb){
		return true;
	}else{
		return false;
	}
}


// 1.7.
function clic_lettre(b)
{
	if (jeu_en_cours) {

		if (lettres_utilisees.indexOf(b.value) == -1){
			lettres_utilisees += b.value;
			zone_essais.value += b.value;
			if(mot_a_deviner.indexOf(b.value) != -1){
				maj_zone_mot();
				if(inclus(mot_a_deviner,lettres_utilisees) == true){
					alert("Bravo ! Le mot était bien " +mot_a_deviner+".Votre score augmente de + "+nb_erreurs_permises);
					zone_score.value = parseInt(zone_score.value) + nb_erreurs_permises;
					reinit();
				}

			}else{
				nb_erreurs_permises --;
				zone_erreurs.value = nb_erreurs_permises;

				if(nb_erreurs_permises <= 2){
					zone_erreurs.style.background = 'red';
					if(nb_erreurs_permises == 0){
						alert("Perdu ! Le mot était " + mot_a_deviner+".Votre score diminue de -2");
						zone_score.value = parseInt(zone_score.value) -2;
						reinit();
					}
				}

			}
			
		}
		else {
			alert("La lettre "+b.value+" a déjà été utilisée !");
		}
	}
}

//--------------------------------------------
// 2.1.
// Fonction relançant une nouvelle partie
//--------------------------------------------
function nouvelle_partie()
{

	if (!jeu_en_cours)
	{
		// TODO Appel AJAX à ajouter
	
		ajax_get_request(maj_mot_a_deviner,"generation.php",false);
		lettres_utilisees = mot_a_deviner.charAt(0) + mot_a_deviner.charAt(mot_a_deviner.length-1);
		zone_erreurs.value = nb_erreurs_permises;
		zone_essais.value = "";
		zone_score.value = score;
		maj_zone_mot();
		jeu_en_cours = true;
	}
	else {
		alert("il faut finir la partie");
	}

}

// 2.2.
function maj_mot_a_deviner(rep)
{
	var obj = JSON.parse(rep);
	mot_a_deviner = obj.mot;
	nb_erreurs_permises = obj.nb_essais;
}


// Fonction ajax_get_request
// (Fonction fournie => À NE PAS MODIFIER !)
function ajax_get_request(callback, url, async = true) {
	// Instanciation d'un objet XHR
	var xhr = new XMLHttpRequest(); 

	// Définition de la fonction à exécuter à chaque changement d'état
	xhr.onreadystatechange = function(){
		if (callback && xhr.readyState == XMLHttpRequest.DONE 
				&& (xhr.status == 200 || xhr.status == 0))
		{
			// Si une fonction callback est définie + que le serveur a fini son travail
			// + que le code d'état indique que tout s'est bien passé
			// => On appelle la fonction callback en passant en paramètre
			//		les données récupérées sous forme de texte brut
			callback(xhr.responseText);
		}
	};

	// Initialisation de l'objet puis envoi de la requête
	xhr.open("GET", url, async); 
	xhr.send();
}

function save(){
	localStorage.setItem('lettre',lettres_utilisees);
	localStorage.setItem('mot',mot_a_deviner);
	localStorage.setItem('score',score);
	localStorage.setItem('erreur',nb_erreurs_permises);
	localStorage.setItem('jeu',jeu_en_cours);
	localStorage.setItem('zone_essai',zone_essais);
	localStorage.setItem('zone_mot',zone_mot);




	


}