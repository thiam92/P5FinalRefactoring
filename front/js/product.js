//recupération des elements fiche produit

let imageProduct = document.querySelector(".item__img");
let productDesignation = document.getElementById("title");
let price = document.getElementById("price");
let description = document.getElementById("description");

// recuperation de l'url qui contient l'id produit

let product = new URL(window.location.href).searchParams;
let id = product.get("id");

let colorPick = document.getElementById("colors");
let quantity = document.getElementById("quantity");
let addToCard = document.getElementById("addToCart");

function productDisplay() {
  //recup des données apres concatenation de l'addresse produit avec la variable de page
  fetch(`http://localhost:3000/api/products/${id}`)
    .then((res) => res.json())
    .then((kanapItem) => {
      //recuperation des variables produits

      let colors = kanapItem.colors;

      //integration dynamique en HTML des caracteres du produit selon la page selectionnée
      imageProduct.innerHTML = `<img src="${kanapItem.imageUrl}" alt="${kanapItem.altText}">`;
      productDesignation.innerHTML = kanapItem.name;
      price.innerHTML = kanapItem.price;
      description.innerHTML = kanapItem.description;
      //integration choix des couleurs
      for (let i = 0; i < colors.length; i++) {
        const colorChoice = colors[i];

        //integration dynamique du choix des couleurs dans HTML
        colorPick.innerHTML += ` <option value="${colorChoice}">${colorChoice}</option> 
          `;
      }
    });
}

function addBasket() {
  addToCard.addEventListener("click", function () {
    const products = JSON.parse(localStorage.getItem("products")) || [];

    if (colorPick.value == "" || quantity.value <= 0 || quantity.value > 100) {
      alert("veuillez choisir une quantité entre 1 et 100 ET une couleur");
    } else {
      let productFound = products.find((product) => {
        return product.id === id && product.color === colorPick.value;
      });
      if (productFound) {
        productFound.quantity += +quantity.value;
      } else {
        products.push({
          id: id,
          quantity: +quantity.value,
          color: colorPick.value,
        });
      }

      window.localStorage.setItem("products", JSON.stringify(products));
      alert(`Le panier a bien été mis à jour`);
      // }
    }
  });
}
productDisplay();
addBasket();
