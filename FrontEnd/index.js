// I. Variable :
let btnLogin = document.getElementById('login');
let btnConnect = document.getElementById('connexion');
let divBtnConnect = document.getElementById('fn-container');
let mainLogin = document.getElementById('login-container');
let mainIndex = document.getElementById('index-container');
let topBar = document.getElementById('top-bar');

// ********************************* => II. Route Works */

// A) Requete http fetch (appel de l'Api) :
async function getWorks() {
  let response = await fetch('http://localhost:5678/api/works');
  return await response.json();
}

/* B) Affichage des Works */
async function listeWorks() {
  let work = await getWorks();
  let produit = document.getElementById('gallery');

  /* a) Affichage de la liste des works + creation de DOM*/
  work.forEach((project) => {
    /* b) Creation des élements HTML : */
    let projectContainer = document.createElement('figure');
    let projectImg = document.createElement('img');
    let projectLegend = document.createElement('figcaption');

    /* c) Hiérarchisation des éléments html crées */
    produit.appendChild(projectContainer);
    projectContainer.appendChild(projectImg);
    projectContainer.appendChild(projectLegend);

    /* d) Attribution des données aux éléments crées */
    projectImg.setAttribute('src', project.imageUrl);
    projectImg.setAttribute('alt', project.title);
    projectImg.classList.add('adapt-img');
    projectLegend.textContent = project.title;
  });
}

listeWorks();

// ---------------------------------------------------------------------------------------------------------

// ********************************* => III. Route Categories :

// A) Requete fetch + variable :
async function getWorkByCategory() {
  // a) Création d'une variable "response" avec une requette AJAX ('fetch') + await pour permettre d'attendre la réponse (nécessaire pour une API)
  let response = await fetch('http://localhost:5678/api/categories');
  // b) Création d'une variable "categories" la response en json (.json) + await pour attendre (function asynchrone)
  let categories = await response.json();
  // c) Création d'une variable 'filters" qui permet de sélectionner l'élement html avec l'id "filters"
  let filters = document.getElementById('filters');
  // d) On vient cibler la balise section ayant l'id "gallery"  dans le document index.html
  let produit = document.getElementById('gallery');
  // e) Appel de la fonction getWorks
  let works = await getWorks();

  // B) Affichage du bouton "Tous" :
  let allProjectsBtn = document.createElement('button');
  allProjectsBtn.textContent = 'Tous';
  allProjectsBtn.classList.add('btn-filters');
  allProjectsBtn.classList.add('active');
  filters.appendChild(allProjectsBtn);

  // C) Ecouteur d'événements pour afficher tous les projets
  allProjectsBtn.addEventListener('click', async () => {
    // a) Supression du HTML
    produit.innerHTML = '';
    works.forEach((project) => {
      /* b) Creation des élements HTML : */
      let projectContainer = document.createElement('figure');
      let projectImg = document.createElement('img');
      let projectLegend = document.createElement('figcaption');

      /* c) Hiérarchisation des éléments html crées */
      produit.appendChild(projectContainer);
      projectContainer.appendChild(projectImg);
      projectContainer.appendChild(projectLegend);

      /* d) Attribution des données aux éléments crées */
      projectImg.setAttribute('src', project.imageUrl);
      projectImg.setAttribute('alt', project.title);
      projectLegend.textContent = project.title;
    });

    // Supression + Ajout de la class active au "click"
    let allButtons = document.querySelectorAll('.btn-filters');
    allButtons.forEach((btn) => {
      btn.classList.remove('active');
    });
    allProjectsBtn.classList.add('active');
  });

  /* D) Affichage des boutons filtres par catégories */
  categories.forEach((category) => {
    // a) Création d'une variable 'button" qui permet de créer l'élement html button
    let button = document.createElement('button');
    // b) Ajout d'une class à la variable button
    button.classList.add('btn-filters');
    button.textContent = category.name;

    // c) Evenement click pour les boutons de filtres :
    button.addEventListener('click', async () => {
      // d) Fonction .filter () filtrer les éléments du tableau getWorks par rapport a un critère donné
      let filteredWorks = works.filter(
        // e) liaison de la fonction getWorks() avec la propriété categoryId et la fonction getWorkByCategory avec la propriété id
        (work) => work.categoryId === category.id
      );
      // f) Suppression du contenue de l' élément HTML avec la variable produit (div avec l'id galery (plus haut))
      produit.innerHTML = '';

      filteredWorks.forEach((project) => {
        let projectContainer = document.createElement('figure');
        let projectImg = document.createElement('img');
        let projectLegend = document.createElement('figcaption');

        projectContainer.classList.add('project-container');
        projectImg.classList.add('project-img');
        projectLegend.classList.add('project-legend');

        projectImg.setAttribute('src', project.imageUrl);
        projectImg.setAttribute('alt', project.title);
        projectLegend.textContent = project.title;

        produit.appendChild(projectContainer);
        projectContainer.appendChild(projectImg);
        projectContainer.appendChild(projectLegend);
      });

      // g) Supression + Ajout de la class active au "click"
      let filterButtons = document.querySelectorAll('.btn-filters');
      filterButtons.forEach((btn) => {
        btn.classList.remove('active');
      });
      button.classList.add('active');
    });
    filters.appendChild(button);
  });
}

getWorkByCategory();

// ---------------------------------------------------------------------------------------------------------

// ********************************* => IV. Route User/Login

// A. Page de connexion/deconnexion au clic :
btnLogin.addEventListener('click', async () => {
  // Supression de errorDiv (else) :
  let p = document.getElementById('delete');
  if (p != null) {
    p.remove('');
  }
  // Choix : soit deconnecter si le BearToken est présent et on reste sur la page de Base, soit il n'est pas présent et a ce moment la on redirige vers la page de connexion
  // Logout:
  if (localStorage.getItem('token')) {
    // Si l'utilisateur est connecté, supprimer le token du local storage
    localStorage.removeItem('token');

    // Modifier le texte du bouton
    btnLogin.textContent = 'login';
    // Cacher la barre 'topBar'
    topBar.style.display = 'none';

    // Login :
  } else {
    // Si l'utilisateur n'est pas connecté (pas de BearToken), afficher la page de connexion
    // Masquer le contenu de la page d'accueil
    mainIndex.style.display = 'none';
    // Afficher le contenu de la page de connexion
    mainLogin.style.display = 'flex';
    btnLogin.classList.add('dark');
  }
});

// B. Envoie du formulaire :
btnConnect.addEventListener('click', async () => {
  // récupération des valeurs du formulaire
  // (value permet de récuperer la valeur des élements rentrer dans la zone de texte email + password)
  let email = document.getElementById('email').value;
  let password = document.getElementById('password').value;

  // Envoie de la requête à l'API
  let response = await fetch('http://localhost:5678/api/users/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    // body de la requete : réponse en json (transformation du js en json via .stringify)
    body: JSON.stringify({ email: email, password: password }),
  });

  // Analyse de la réponse
  if (response.status === 200) {
    let responseJson = await response.json();
    // Sauvegarde du BearerToken dans le localStorage sous le nom de "token"
    localStorage.setItem('token', responseJson.token);

    // Afficher le contenu de la page d'accueil
    mainIndex.style.display = '';
    // Masquer le contenu de la page de connexion
    mainLogin.style.display = 'none';
    // modification du texte login
    btnLogin.textContent = 'logout';
    btnLogin.classList.remove('dark');

    // Affichage de la topBar
    if (localStorage.getItem('token')) {
      topBar.style.display = 'flex';
    }
  } else {
    // Supression de l'errorDiv
    let p = document.getElementById('delete');
    if (p != null) {
      p.remove('');
    }
    // Création de la div avec le mess d'erreur + ajout de la class delete (supression si different de null en 193/194/195)
    let errorDiv = document.createElement('p');
    errorDiv.id = 'delete';

    errorDiv.textContent = 'Erreur dans l’identifiant ou le mot de passe';
    divBtnConnect.appendChild(errorDiv);
  }
});

if (localStorage.getItem('token')) {
  topBar.style.display = 'flex';
  btnLogin.textContent = 'logout';
}

// ---------------------------------------------------------------------------------------------------------

// ********************************* => V. Route Post Work / Delete
if (localStorage.getItem('token')) {
  let bearerToken = localStorage.getItem('token');
  let worksToDelete = [];
  let allDeleteWork = [];
  // Route delete :
  async function deleteWork(workId, bearerToken) {
    let response = await fetch(`http://localhost:5678/api/works/${workId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${bearerToken}`,
      },
    });
  }

  // A: Variable :
  let btnModif = document.getElementById('btn-modif');

  // Creation de la div popUP + du fond :
  let popUpDiv = document.createElement('div');
  let overlayDiv = document.createElement('div');
  //Création des div Container de la popUP :
  let popUpNav = document.createElement('div');
  let popUpClose = document.createElement('i');

  let popUpDivTitle = document.createElement('div');
  // Peut etre besoin d'une div general pour les 3 div créer ?
  let popUpDivWorks = document.createElement('div');
  let popUpDivSeparate = document.createElement('div');
  let popUpDivBtn = document.createElement('div');

  // Partie popUp first page
  let titlePopUp = document.createElement('p');
  let btnAddWorks = document.createElement('button');
  let deleteAll = document.createElement('button');

  // Partie popUp Second page
  let btnReturn = document.createElement('i');

  // ---------------------------------------------------------------------------------
  // B. Functio Affichage des works sous format popUp
  async function popUpWorks() {
    // a) on vien stocker le résultat de getWorks dans une variable pour l'utiliser
    let work = await getWorks();
    /* Affichage de la liste des works + creation de DOM*/
    work.forEach((project) => {
      // Recuperation de l'id du project selectionné
      let workId = project.id;
      /* Creation des élements HTML : */
      let workContainer = document.createElement('div');
      let workImgContainer = document.createElement('div');
      let workImg = document.createElement('img');
      let workLegend = document.createElement('p');
      let divIcone = document.createElement('div');
      let mooveIcone = document.createElement('i');
      let deleteIcone = document.createElement('i');

      /* Hiérarchisation des éléments html crées */
      popUpDivWorks.appendChild(workContainer);
      workContainer.appendChild(workImgContainer);
      workImgContainer.appendChild(workImg);
      workImgContainer.appendChild(divIcone);
      divIcone.appendChild(mooveIcone);
      divIcone.appendChild(deleteIcone);
      workContainer.appendChild(workLegend);

      /* Attribution des données aux éléments crées */
      workContainer.classList.add('container-work-popUp');
      workImgContainer.classList.add('container-img');
      divIcone.classList.add('div-icone');

      workImg.setAttribute('src', project.imageUrl);
      workImg.setAttribute('alt', project.title);
      workImg.style.height = '100%';
      workImg.style.objectFit = 'cover';
      workLegend.textContent = 'éditer';
      mooveIcone.setAttribute('class', 'fa-solid fa-arrows-up-down-left-right');
      deleteIcone.setAttribute('class', 'fa-solid fa-trash-can');
      mooveIcone.classList.add('icone-moove');

      // Met tous les id des works dans le tableau allDelete => voir firstPage pour supression
      allDeleteWork.push(workId);
      console.log('=>', allDeleteWork);

      // Ajouter un événement click sur l'icône de suppression pour supprimer les éléments
      deleteIcone.addEventListener('click', async () => {
        // Affiche une boîte de dialogue de confirmation
        let confirmation = confirm(
          'Êtes-vous sûr de vouloir supprimer ce work ?'
        );

        // Demande de confirmation pour stocker dans le tableau workstoDelete les id en question
        if (confirmation) {
          worksToDelete.push(workId);
          // Supprimer l'élément de travail du DOM
          popUpDivWorks.removeChild(workContainer);
        }
      });
    });
  }

  // C. Function Affichage First Page PopUp :
  async function popUpFirstPage() {
    // Ajout de la class a la div popUpDiv
    popUpDiv.classList.add('popUp'); // Ajout de la classe 'popup' à la div

    // Ajout de la class a la div qui va servir de fond semi-transparent pour le reste de la page
    overlayDiv.classList.add('overlay'); // Ajout de la classe 'overlay' à la div

    // Ajout des divs à la page
    document.body.appendChild(popUpDiv);
    document.body.appendChild(overlayDiv);

    // Appenchild du container :
    popUpDiv.appendChild(popUpNav);
    popUpDiv.appendChild(popUpDivTitle);
    popUpDiv.appendChild(popUpDivWorks);
    popUpDiv.appendChild(popUpDivSeparate);
    popUpDiv.appendChild(popUpDivBtn);

    // Ajout des class et attribut des éléments de la div Container :
    popUpClose.setAttribute('class', 'fa-solid fa-xmark');
    popUpNav.appendChild(popUpClose);
    // --------------------------------------------
    popUpNav.classList.add('popUpNav');
    // --------------------------------------------
    titlePopUp.textContent = 'Galerie photo';
    titlePopUp.classList.add('titlePup');
    // --------------------------------------------
    btnAddWorks.textContent = 'Ajouter une photo';
    btnAddWorks.classList.add('btn-green');

    deleteAll.textContent = 'Supprimer la galerie';
    deleteAll.setAttribute('id', 'delete-all');

    // Affichage des works :
    popUpWorks();

    // Ajout de la class containers + Appenchild :
    popUpDivTitle.classList.add('popUpTitle');
    popUpDivTitle.appendChild(titlePopUp);

    popUpDivWorks.classList.add('popUpWork');

    popUpDivSeparate.classList.add('separate');

    popUpDivBtn.classList.add('btn-div-container');
    popUpDivBtn.appendChild(btnAddWorks);
    popUpDivBtn.appendChild(deleteAll);

    popUpNav.style.justifyContent = 'flex-end';

    deleteAll.addEventListener('click', async () => {
      let confirmation = confirm(
        'Êtes-vous sûr de vouloir supprimer TOUS les works ?'
      );

      if (confirmation) {
        allDeleteWork.forEach((workId) => {
          deleteWork(workId, bearerToken);
        });
      }
    });
  }

  // D. Function Affichage Second Page PopUp :
  async function popUpSecondPage(event) {
    event.stopPropagation();
    titlePopUp.textContent = 'Ajout photo';

    // Element de la div popUpDivWorks :
    popUpDivWorks.innerHTML = '';

    let containerAdds = document.createElement('div');
    containerAdds.classList.add('container-adds');
    // -----------------------------------------------------
    let iconeImg = document.createElement('i');
    iconeImg.setAttribute('class', 'fa-regular fa-images');

    let btnAddPicture = document.createElement('button');
    btnAddPicture.classList.add('add-picture');
    btnAddPicture.textContent = '+ Ajouter photo';

    let inputFile = document.createElement('input');
    inputFile.setAttribute('type', 'file');
    // inputFile.setAttribute('id', 'workImage');
    inputFile.setAttribute('accept', 'image/*');
    inputFile.setAttribute('style', 'display:none;');

    let limitText = document.createElement('p');
    limitText.textContent = 'jpg, png : 4mo max';
    // -----------------------------------------------------
    let label1 = document.createElement('label');
    label1.textContent = 'Titre';

    let inputTitle = document.createElement('input');
    inputTitle.setAttribute('type', 'text');
    inputTitle.setAttribute('name', 'text');
    inputTitle.setAttribute('id', 'title');

    let label2 = document.createElement('label');
    label2.textContent = 'Catégorie';

    let selectCategory = document.createElement('select');
    selectCategory.setAttribute('id', 'categoryInput');

    let option0 = document.createElement('option');
    let option1 = document.createElement('option');
    let option2 = document.createElement('option');
    let option3 = document.createElement('option');

    option0.textContent = 'Selectionnez une catégorie';
    option0.setAttribute('value', '');
    option0.setAttribute('selected', 'selected');

    option1.textContent = 'Objets';
    option1.setAttribute('value', '1');

    option2.textContent = 'Appartements';
    option2.setAttribute('value', '2');

    option3.textContent = 'Hotels & restaurants';
    option3.setAttribute('value', '3');
    // -----------------------------------------------------

    popUpDivWorks.appendChild(containerAdds);
    containerAdds.appendChild(iconeImg);
    containerAdds.appendChild(btnAddPicture);
    containerAdds.appendChild(inputFile);
    containerAdds.appendChild(limitText);

    popUpDivWorks.appendChild(label1);
    popUpDivWorks.appendChild(inputTitle);
    popUpDivWorks.appendChild(label2);
    popUpDivWorks.appendChild(selectCategory);

    selectCategory.appendChild(option0);
    selectCategory.appendChild(option1);
    selectCategory.appendChild(option2);
    selectCategory.appendChild(option3);

    // Element de la div popUpDivBtn  :
    popUpDivBtn.innerHTML = '';

    let messRoutePost = document.createElement('p');
    messRoutePost.classList.add('mess-post');
    let btnValid = document.createElement('button');
    btnValid.classList.add('btn-valid');
    btnValid.textContent = 'Valider';

    popUpDivBtn.appendChild(btnValid);
    popUpDivBtn.appendChild(messRoutePost);

    // ------------------------------------------------------
    // Ajout a la barre de Nav d'une etiquette de retour

    btnReturn.setAttribute('class', 'fa-sharp fa-solid fa-arrow-left');
    btnReturn.classList.add('icone-return');

    popUpNav.insertBefore(btnReturn, popUpClose);
    popUpNav.style.justifyContent = 'space-between';
    // ------------------------------------------------------
    // Ajouter une image :
    btnAddPicture.addEventListener('click', function () {
      inputFile.click();
    });

    inputFile.addEventListener('change', function () {
      let file = inputFile.files[0];
      let maxSize = 4 * 1024 * 1024;

      if (file.size > maxSize) {
        errorImg.textContent = 'Votre image est trop volumineuse';
        console.log('fichier > 4MO!');
        return;
      }
    });

    // Update des informations
    function updateValidateButton() {
      if (
        inputTitle.value &&
        categoryInput.value &&
        inputFile.files.length > 0
      ) {
        btnValid.style.backgroundColor = '#1D6154';
        btnValid.style.cursor = 'pointer';
      } else {
        btnValid.style.backgroundColor = ''; // Remet la couleur par défaut
      }
    }
    // Affichage de l'image ajouté
    function displaySelectedImage() {
      if (inputFile.files.length > 0) {
        containerAdds.innerHTML = ''; // Efface le contenu actuel de containerAdds pour remplacer par une image

        let img = document.createElement('img');
        img.src = URL.createObjectURL(inputFile.files[0]);
        console.log(img.src);
        img.style.maxWidth = '100%';
        img.style.maxHeight = '100%';
        // onload = permet d'attendre que l'image soit completement chargé
        img.onload = function () {
          // rappel de l'objet blob pour le montrer sur le site sans telecharger dans la base de donnée
          URL.revokeObjectURL(img.src);
        };
        containerAdds.appendChild(img);
      }
    }

    inputTitle.addEventListener('input', updateValidateButton);
    categoryInput.addEventListener('change', updateValidateButton);
    inputFile.addEventListener('change', function () {
      updateValidateButton();
      displaySelectedImage();
    });

    // Route Post work :
    async function postWork(bearerToken) {
      let fileName = inputFile.files[0];
      let formData = new FormData();
      formData.append('image', fileName);
      formData.append('title', inputTitle.value);
      formData.append('category', categoryInput.value);
      console.log(formData);

      let response = await fetch(`http://localhost:5678/api/works`, {
        method: 'POST',
        headers: {
          // Accept: 'application/json',
          Authorization: `Bearer ${bearerToken}`,
        },
        body: formData,
      });

      // Gérez les réponses
      if (response.status === 201) {
        messRoutePost.textContent = 'Votre travail a été soumis avec succès !';
      } else {
        messRoutePost.textContent =
          'Erreur lors de la soumission, veuillez réessayer.';
      }
    }

    btnValid.addEventListener('click', () => {
      postWork(bearerToken);
      // Supression des works de la base de données :
      worksToDelete.forEach((workId) => {
        deleteWork(workId, bearerToken);
      });
      // Vide la liste des works à supprimer
      worksToDelete = [];
    });
  }

  // ------------------------------------------------------------------------
  // E. Création de la premiere page popUP au click
  btnModif.addEventListener('click', popUpFirstPage);

  // F. Redirection 2ème page Pop Up :
  btnAddWorks.addEventListener('click', popUpSecondPage);

  // G. Redirection page 2 popUp a page 1 popUp :
  btnReturn.addEventListener('click', async () => {
    // Reset
    btnReturn.remove();
    popUpDivWorks.innerHTML = '';
    popUpDivBtn.innerHTML = '';
    popUpDivTitle.innerHTML = '';
    popUpNav.innerHTML = '';
    popUpFirstPage();
  });

  // ---------------------------------------------------------------------------
  // H. Fermeture de la popUp lors du clic sur l'overlay :
  overlayDiv.addEventListener('click', () => {
    // Supression des works de la base de données :
    worksToDelete.forEach((workId) => {
      deleteWork(workId, bearerToken);
    });
    // Vide la liste des works à supprimer
    worksToDelete = [];

    popUpDiv.classList.remove('popUp');
    overlayDiv.classList.remove('overlay');
    btnReturn.remove();
    popUpDivWorks.innerHTML = '';
    popUpDivBtn.innerHTML = '';
    popUpDivTitle.innerHTML = '';
    popUpNav.innerHTML = '';
    popUpDivSeparate.classList.remove('separate');
  });
  // I. Fermeture de la popUp lors du clic sur l'icône de fermeture :
  popUpClose.addEventListener('click', () => {
    overlayDiv.click(); // Simuler un clic sur l'overlay pour fermer la pop-up
  });
}
