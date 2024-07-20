// Function to add item to cart
function addToCart(name, price, image) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.name === name);

    if (existingProductIndex > -1) {
        cart[existingProductIndex].quantity += 1;
    } else {
        cart.push({
            name,
            price,
            image,
            quantity: 1
        });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    updateTotalPrice();
    updateButtonState(); // Update button state after adding to cart
}

// Function to display cart items
function displayCart() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('product-details');

    if (!cartContainer) {
        console.error('Element with id "product-details" not found.');
        return;
    }

    cartContainer.innerHTML = `
        <div id="total-price-container">
            <h2>Total Price: $<span id="total-price">0.00</span></h2>
        </div>
    `;

    cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';
        itemDiv.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <h4>${item.name}</h4>
            <p>Price: $${item.price}</p>
            <p>Quantity: <button class="decrease" data-name="${item.name}">-</button> ${item.quantity} <button class="increase" data-name="${item.name}">+</button></p>
            <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
            <button class="remove" data-name="${item.name}">Remove</button>
        `;
        cartContainer.appendChild(itemDiv);
    });

    updateTotalPrice();
}

// Function to update quantity of an item
function updateQuantity(name, change) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const product = cart.find(item => item.name === name);

    if (product) {
        product.quantity += change;

        if (product.quantity <= 0) {
            const index = cart.indexOf(product);
            cart.splice(index, 1);
        }

        localStorage.setItem('cart', JSON.stringify(cart));
        displayCart();
        updateCartCount();
        updateTotalPrice();
        updateButtonState(); // Update button state after quantity change
    }
}

// Function to remove an item from the cart
function removeItem(name) {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter(item => item.name !== name);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    displayCart();
    updateCartCount();
    updateTotalPrice();
    updateButtonState(); // Update button state after removal
}

// Function to update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartSpan = document.querySelector('header span');
    if (cartSpan) {
        cartSpan.textContent = cartCount;
    }
}

// Function to update total price
function updateTotalPrice() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const totalPrice = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const totalPriceSpan = document.getElementById('total-price');
    if (totalPriceSpan) {
        totalPriceSpan.textContent = totalPrice.toFixed(2);
    }
}

// Function to update button state based on cart
function updateButtonState() {
    document.querySelectorAll('.addCart').forEach(button => {
        const productName = button.dataset.name;
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        const isInCart = cart.some(item => item.name === productName);
        button.disabled = isInCart;
    });
}

// Run displayCart and updateCartCount only on cart page
document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('product-details')) {
        displayCart();
    }

    // Update cart count and total price on page load
    updateCartCount();
    updateTotalPrice();
    updateButtonState(); // Update button state on page load

    document.querySelectorAll('.addCart').forEach(button => {
        button.addEventListener('click', () => {
            addToCart(button.dataset.name, button.dataset.price, button.dataset.image);
            alert(`${button.dataset.name} has been added to the cart.`);
        });
    });

    const cartContainer = document.getElementById('product-details');
    if (cartContainer) {
        cartContainer.addEventListener('click', (event) => {
            if (event.target.classList.contains('increase')) {
                updateQuantity(event.target.dataset.name, 1);
            } else if (event.target.classList.contains('decrease')) {
                updateQuantity(event.target.dataset.name, -1);
            } else if (event.target.classList.contains('remove')) {
                removeItem(event.target.dataset.name);
            }
        });
    }
});
