function orderConfirmation() {
    
    // Le numéro de commande apparait uniquement sur la page web et le Local storage est vidé
    let idUrl = new URL(window.location.href).searchParams;
    orderId = idUrl.get("id");
   
    orderIdContainer = document.getElementById("orderId");
    orderIdContainer.innerHTML = orderId;
}
  
orderConfirmation();