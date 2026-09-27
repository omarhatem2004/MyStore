let products = [];
let cart = [];

let productsToDisplay = [];
let currentPage = 1;
const productsPerPage = 6;


async function loadProducts() {

    const response = await fetch("https://fakestoreapi.com/products");

    const data = await response.json();

    products = data;
    productsToDisplay = products;

    console.log(data);

    showPage(1);
}


function showProducts(productsToShow) {

    const productList = document.querySelector(".productList");
    // productList.innerHTML = `<div>
    // <img src="${products[0].image}"">
    // <p>${products[0].title}</p>
    // <p>${products[0].price}</p>
    // </div>
    // `;

    productList.innerHTML = "";

    productsToShow.forEach((product) => {

        productList.innerHTML +=
            `
            <div>

                <img src="${product.image}">

                <p>${product.title}</p>

                <p class="price">$${product.price}</p>

                <button class="detail-btn" data-id="${product.id}">
                    View details
                </button>

                <button class="add-cart-btn" data-id="${product.id}">
                    Add to Cart
                </button>

            </div>
            `;
    });


    document.querySelectorAll(".add-cart-btn").forEach((button) => {

        button.addEventListener("click", () => {

            addToCart(button.dataset.id);

        });

    });

}


function showPage(page) {

    currentPage = page;

    const start = (page - 1) * productsPerPage;

    const end = start + productsPerPage;

    const productsOnPage = productsToDisplay.slice(start, end);

    showProducts(productsOnPage);

    showPagination();
}


function showPagination() {

    const pagination = document.querySelector("#pagination");

    pagination.innerHTML = "";

    const totalPages = Math.ceil(productsToDisplay.length / productsPerPage);

    const previousButton = document.createElement("button");
    previousButton.textContent = "Previous";
    previousButton.disabled = currentPage === 1;
    previousButton.addEventListener("click", () => showPage(currentPage - 1));
    pagination.appendChild(previousButton);

    for (let i = 1; i <= totalPages; i++) {

        const button = document.createElement("button");

        button.textContent = i;

        if (i === currentPage) {
            button.classList.add("active");
        }

        button.addEventListener("click", () => {

            showPage(i);

        });

        pagination.appendChild(button);
    }

    const nextButton = document.createElement("button");
    nextButton.textContent = "Next";
    nextButton.disabled = currentPage === totalPages || totalPages === 0;
    nextButton.addEventListener("click", () => showPage(currentPage + 1));
    pagination.appendChild(nextButton);
}


loadProducts();


document.querySelector("#apply-filters").addEventListener("click", () => {

    const searchResult = document.querySelector("#search-bar").value.toLowerCase();

    const category = document.querySelector("#category-select").value;

    const minPrice = document.querySelector("#min-price").value;

    const maxPrice = document.querySelector("#max-price").value;


    productsToDisplay = products.filter((product) => {

        return product.title.toLowerCase().includes(searchResult)

            && (category === "all" || product.category === category)

            && (product.price >= minPrice || minPrice === "")

            && (product.price <= maxPrice || maxPrice === "");

    });


    showPage(1);

});


document.querySelector("#sort-select").addEventListener("change", () => {

    const sortBy = document.querySelector("#sort-select").value;

    productsToDisplay.sort((a, b) => {

        if (sortBy === "sort-by-name") {

            return a.title.localeCompare(b.title);

        }

        if (sortBy === "sort-by-price") {

            return a.price - b.price;

        }

        if (sortBy === "sort-by-rating") {

            return b.rating.rate - a.rating.rate;

        }

    });


    showPage(1);

});


function addToCart(productID) {

    const addedToCart =
        products.find((product) => product.id == productID);

    cart.push(addedToCart);

    renderCart();

    updateCartTotal();

}


function renderCart() {

    const cartItems =
        document.querySelector("#cart-items");

    cartItems.innerHTML = "";


    if (cart.length === 0) {

        cartItems.innerHTML =
            `<li class="empty-cart">Your cart is empty</li>`;

        return;
    }


    const uniqueProducts = [];

    cart.forEach((product) => {

        const alreadyExists = uniqueProducts.find((item) => item.id == product.id);

        if (!alreadyExists) {

            uniqueProducts.push(product);

        }

    });


    uniqueProducts.forEach((product) => {

        const quantity = cart.filter((item) => item.id == product.id).length;


        cartItems.innerHTML +=
            `
            <li>

                <span class="cart-product">
                    ${product.title} - $${product.price}
                </span>

                <div class="cart-controls">

                    <button
                        class="decrease-btn"
                        data-id="${product.id}">
                        -
                    </button>

                    <span>${quantity}</span>

                    <button
                        class="increase-btn"
                        data-id="${product.id}">
                        +
                    </button>

                    <button
                        class="remove-btn"
                        data-id="${product.id}">
                        Remove
                    </button>

                </div>

            </li>
            `;
    });

}


function updateCartTotal() {

    let totalQuantity = cart.length;

    let totalPrice = 0;


    cart.forEach((product) => {

        totalPrice += product.price;

    });


    document.querySelector("#cart-quantity").textContent = totalQuantity;

    document.querySelector("#cart-total").textContent = totalPrice.toFixed(2);

}


function removeFromCart(productID) {

    cart = cart.filter((product) => product.id != productID);

    renderCart();

    updateCartTotal();

}


document.querySelector("#cart-items").addEventListener("click", (event) => {

    const productID = event.target.dataset.id;


    if (event.target.classList.contains("remove-btn")) {

        removeFromCart(productID);

    }


    if (event.target.classList.contains("increase-btn")) {

        const product = products.find((product) => product.id == productID);

        cart.push(product);

        renderCart();

        updateCartTotal();

    }


    if (event.target.classList.contains("decrease-btn")) {

        const index = cart.findIndex((product) => product.id == productID);


        if (index !== -1) {

            cart.splice(index, 1);

        }

        renderCart();

        updateCartTotal();

    }

});


function showProductDetails(productID) {

    const product =
        products.find((product) => product.id == productID);

    if (!product) {
        return;
    }

    const details = document.querySelector("#product-details");

    details.innerHTML = `
        <button class="back-to-products" type="button">Back to products</button>
        <article class="product-detail">
            <div class="product-detail-image">
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div class="product-detail-info">
                <h2 id="product-detail-title">${product.title}</h2>
                <p class="detail-description">${product.description}</p>
                <p><strong>Category:</strong> ${product.category}</p>
                <p class="detail-price">Price: $${product.price.toFixed(2)}</p>
                <p><strong>Rating:</strong> ${product.rating.rate} (${product.rating.count} reviews)</p>
                <button class="detail-add-cart" type="button" data-id="${product.id}">Add to Cart</button>
            </div>
        </article>
    `;

    details.showModal();

}


document.querySelector("#product-details").addEventListener("click", (event) => {

    if (event.target.classList.contains("back-to-products")) {
        document.querySelector("#product-details").close();
    }

    if (event.target.classList.contains("detail-add-cart")) {
        addToCart(event.target.dataset.id);
    }

    if (event.target.id === "product-details") {
        event.target.close();
    }

});


document.querySelector(".productList").addEventListener("click", (event) => {

    if (event.target.classList.contains("detail-btn")) {

        showProductDetails(event.target.dataset.id);

    }

});