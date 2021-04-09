const cartDOM = document.querySelector(".cart__items");
const addToCartBtn = document.querySelectorAll(".btn__add__to__cart");
const cartCounter = document.querySelector(".cart__counter");
const totalCost = document.querySelector(".total__cost");
const totalCount = document.querySelector("#total__counter");
const checkOutBtn = document.querySelector(".check_out_btn");
const closeCartBtn = document.querySelector(".close_cart_btn");
const totalBooks = document.querySelector(".total_books");
const freeFreight = document.querySelector(".free_freight_result");


function searchBookNameFieldButton() {
    let searchBookNameField = document.getElementById("book-name-field").value
    console.log(searchBookNameField)

    let bookNameStatus = document.getElementById("books-status")
    bookNameStatus.innerHTML = "<strong>Utsåld</strong>"
}

// assign all values from local storage
let cartItems = (JSON.parse(localStorage.getItem("cart_items")) || []);

document.addEventListener("DOMContentLoaded", loadData);

checkOutBtn.addEventListener("click", () => {
    alert("Your order sent successfully");
    clearCartItems();
})

closeCartBtn.addEventListener("click", () => {
    alert("Are you sure to leave this cart?");
    closeCart();
})

cartCounter.addEventListener("click", () => {
    cartDOM.classList.toggle("active");
})

addToCartBtn.forEach(btn => {
    btn.addEventListener("click", () => {
        let parentElement = btn.parentElement;

        const product = {
            class: parentElement.querySelector(".product__id").value,
            name: parentElement.querySelector(".product__name").innerText,
            image: parentElement.querySelector(".image").getAttribute("src"),
            price: parentElement.querySelector(".product__price").innerText.replace("kr", ""),
            quantity: 1
        }

        let isInCart = cartItems.filter(item => item.class === product.class).length > 0;

        // check if already Exists
        if (!isInCart) {
            addItemToTheDOM(product);
        } else {
            alert("This book is already in the cart!");
            return;
        }

        const cartDOMItems = document.querySelectorAll(".cart_item");
        cartDOMItems.forEach(individualItem => {
            if (individualItem.querySelector(".product__id").value === product.class) {
                // increase
                increaseItem(individualItem, product);
                // decrease
                decreaseItem(individualItem, product);
                // Removing Element
                removeItem(individualItem, product);
            }
        })
        cartItems.push(product);
        calculateTotal();
        saveToLocalStorage();
    });
})

function loadData() {
    if (cartItems.length > 0) {
        cartItems.forEach(product => {
            addItemToTheDOM(product);
            const cartDOMItems = document.querySelectorAll(".cart_item");
            cartDOMItems.forEach(individualItem => {
                if (individualItem.querySelector(".product__id").value === product.class) {
                    // increase
                    increaseItem(individualItem, product);
                    // decrease
                    decreaseItem(individualItem, product);
                    // Removing Element
                    removeItem(individualItem, product);
                }
            });
        });
        calculateTotal();
    }
}

function calculateTotal() {
    let total = 0;
    let calculateTotalBooks = 0;
    cartItems.forEach(item => {
        total += item.quantity * item.price; 
        calculateTotalBooks += item.quantity;
    });
    totalCost.innerText = total;
    totalBooks.innerText = calculateTotalBooks;
    totalCount.innerText = cartItems.length;
    if (total >= 159) {
        freeFreight.innerText = "You have free freight!";
    } else {
        let x = 159-total;
        freeFreight.innerText = "Free freight over 159 kr: (" +x.toString()+ " kr) left";
    }
}

function saveToLocalStorage() {
    localStorage.setItem("cart_items", JSON.stringify(cartItems));
}

function clearCartItems() {
    localStorage.clear();
    cartItems = [];
    document.querySelectorAll(".cart__items").forEach(item => {
        item.querySelectorAll(".cart_item").forEach(node => {
            node.remove();
        });
    });
    cartDOM.classList.toggle("active");
    calculateTotal();
}

function closeCart() {
    localStorage.clear();
    cartItems = [];
    document.querySelectorAll(".cart__items").forEach(item => {
        item.querySelectorAll(".cart_item").forEach(node => {
            node.remove();
        });
    });
    cartDOM.classList.toggle("active");
    calculateTotal();
}

function addItemToTheDOM(product) {
    // Adding the new Item to the Dom
    cartDOM.insertAdjacentHTML("afterbegin", `<div class="cart_item">
            <input type="hidden" class="product__id" value="${product.class}">
           <img id="product_image" src="${product.image}" alt="" srcset="">
           <h4 class="product__name">${product.name}</h4>
           <a class="btn__small" action="decrease">&minus;</a> <h4 class="product__quantity">${product.quantity}</h4><a class="btn__small" action="increase">&plus;</a>
          <span id="product__price">${product.price}</span>
           <a class="btn__small btn_remove" action="remove">&times;</a>
       </div>`);
}

function increaseItem(individualItem, product) {
    individualItem.querySelector("[action='increase']").addEventListener('click', () => {
        // Actual Array
        cartItems.forEach(cartItem => {
            if (cartItem.class === product.class) {
                individualItem.querySelector(".product__quantity").innerText = ++cartItem.quantity;
                calculateTotal();
                saveToLocalStorage();
            }
        })
    });
}

function decreaseItem(individualItem, product) {
    individualItem.querySelector("[action='decrease']").addEventListener('click', () => {
        // all cart items in the dom
        cartItems.forEach(cartItem => {
            // Actual Array
            if (cartItem.class === product.class) {
                if (cartItem.quantity > 1) {
                    individualItem.querySelector(".product__quantity").innerText = --cartItem.quantity;
                    calculateTotal();
                    saveToLocalStorage();
                } else {
                    // removing this element and assign the new elements to the old of the array
                    console.log(cartItems);
                    cartItems = cartItems.filter(newElements => newElements.class !== product.class);
                    individualItem.remove();
                    calculateTotal();
                    saveToLocalStorage();
                }
            }
        })
    });
}

function removeItem(individualItem, product) {
    individualItem.querySelector("[action='remove']").addEventListener('click', () => {
        cartItems.forEach(cartItem => {
            if (cartItem.class === product.class) {
                cartItems = cartItems.filter(newElements => newElements.class !== product.class);
                individualItem.remove();
                calculateTotal();
                saveToLocalStorage();
            }
        })
    });
}