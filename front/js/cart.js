let productsLs = JSON.parse(localStorage.getItem("products"));
let totalQuantity = document.getElementById("totalQuantity");
let totalPrice = document.getElementById("totalPrice");
let sum = 0;
let totalArticlesPrice = 0;
const cartItems = document.getElementById("cart__items");

const url = "http://localhost:3000/api/products/";

function displayBasket() {
  if (productsLs === null) {
    document.location.href = "./index.html";
  }

  let promises = [];
  productsLs.forEach((product) => {
    let id = product.id;

    const promise = fetch(url + id).then((res) => res.json());

    promises.push(promise);
  });
  Promise.all(promises).then((products) => {
    products.forEach((product, i) => {
      let price = product.price;
      let qty = productsLs[i].quantity;
      let color = productsLs[i].color;
      getTotal(price, qty);

      cartItems.innerHTML += `<article class="cart__item" data-id="{${product.id}}" data-color="{${color}}">
                <div class="cart__item__img">
                  <img src="${product.imageUrl}" alt="${product.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${product.name}</h2>
                    <p>${color}</p>
                    <p>${product.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté : </p>
                    
                          <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${qty}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
               </div>
              </article> `;
    });
    quantityChange();
    deleteItem();
  });
}
displayBasket();

function getTotal(price, qty) {
  totalArticlesPrice += +price * qty;

  sum += +qty;
  totalQuantity.innerHTML = sum;
  totalPrice.innerHTML = totalArticlesPrice;
}
function deleteItem() {
  let deleteBtns = document.querySelectorAll(".deleteItem");

  for (let j = 0; j < deleteBtns.length; j++) {
    const deleteBtn = deleteBtns[j];

    deleteBtn.addEventListener("click", (e) => {
      deleteId = productsLs[j].id;
      deleteColor = productsLs[j].color;

      productsLs = productsLs.filter((product) => product.id != deleteId || product.color != deleteColor);

      localStorage.setItem("products", JSON.stringify(productsLs));

      if (productsLs.length === 0) {
        localStorage.removeItem("products");
      }
      location.reload();
    });
  }
}

function quantityChange() {
  let changeQuantity = document.querySelectorAll(".itemQuantity");

  for (let k = 0; k < changeQuantity.length; k++) {
    const modifQuantity = changeQuantity[k];

    modifQuantity.addEventListener("focusout", (e) => {
      e.preventDefault();
      if (e.target.value < 0 || e.target.value > 100) {
        alert("choisir une quantitée entre 1 et 100");
      } else {
        productsLs[k].quantity = e.target.value;

        localStorage.setItem("products", JSON.stringify(productsLs));
        location.reload();
      }
    });
  }
}

let myForm = document.querySelector(".cart__order__form");

let regexAddress = /^[A-Za-z\s0-9-'àéèç,/]{10,60}$/;
let regexNomPrenomVille = /^[A-Za-z\s-'àéèç]{2,50}$/;
let regexEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;

let firstNameValid = document.getElementById("firstName");
let firstNameError = document.getElementById("firstNameErrorMsg");

let lastNameValid = document.getElementById("lastName");
let lastNameError = document.getElementById("lastNameErrorMsg");

let addressValid = document.getElementById("address");
let addressError = document.getElementById("addressErrorMsg");

let mailValid = document.getElementById("email");
let mailError = document.getElementById("emailErrorMsg");

let cityValid = document.getElementById("city");
let cityError = document.getElementById("cityErrorMsg");

function regexValid(button, regex, displayError, text) {
  button.addEventListener("change", (e) => {
    if (regex.test(e.target.value) === false) {
      displayError.innerText = text;
      e.target.value = "";
    } else {
      displayError.innerText = "";
    }
  });
}

let btnOrder = document.getElementById("order");

function getOrderId() {
  myForm.addEventListener("submit", (e) => {
    e.preventDefault();
    let contact = {
      firstName: firstNameValid.value,
      lastName: lastNameValid.value,
      city: cityValid.value,
      address: addressValid.value,
      email: mailValid.value,
    };

    const ids = productsLs.map((element) => element.id);
    console.log(ids);
    products = ids;

    let envoi = { contact, products };

    fetch("http://localhost:3000/api/products/order", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(envoi),
    })
      .then((res) => res.json())
      .then((order) => {
        console.log(order.orderId);

        document.location.href = `confirmation.html?id=${order.orderId}`;

        localStorage.removeItem("products");
      });
  });
}
regexValid(firstNameValid, regexNomPrenomVille, firstNameError, "prenom invalide");

regexValid(lastNameValid, regexNomPrenomVille, lastNameError, "nom invalide");

regexValid(cityValid, regexNomPrenomVille, cityError, "Nom de ville invalide");

regexValid(mailValid, regexEmail, mailError, "Mail Invalide");

regexValid(addressValid, regexAddress, addressError, "Addresse non valide");

getOrderId();
