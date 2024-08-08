/* This JavaScript code adds a "sticky" class to the header element when the page is scrolled beyond the top, creating a sticky header effect.*/
// Sticky header effect
const header = document.querySelector("header");

window.addEventListener("scroll", function() {
    header.classList.toggle("sticky", window.scrollY > 0);
});

// Menu toggle
let menu = document.querySelector('#menu-icon');
let navmenu = document.querySelector('.nav-bar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navmenu.classList.toggle('open');
};

document.addEventListener('DOMContentLoaded', () => {
    const tableBody = document.querySelector('#order-summary tbody');
    const totalPriceElement = document.getElementById('total-price');
    const addToFavouritesButton = document.getElementById('add-to-favourites');
    const applyFavouritesButton = document.getElementById('apply-favourites');
    const clearCartButton = document.getElementById('clear-cart');
    const clearFavouritesButton = document.getElementById('clear-favourites');

    let orderItems = JSON.parse(localStorage.getItem('orderItems')) || [];

    function updateTable() {
        tableBody.innerHTML = '';
        let totalPrice = 0;

        orderItems.forEach(item => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${item.product}</td>
                <td>${item.quantity} ${item.unit}</td>
                <td>Rs.${item.total.toFixed(2)}</td>
            `;
            tableBody.appendChild(row);
            totalPrice += item.total;
        });

        totalPriceElement.textContent = `Rs. ${totalPrice.toFixed(2)}`;
    }

    function updateItem(product, quantity, unit, price) {
        const existingItemIndex = orderItems.findIndex(item => item.product === product);

        if (existingItemIndex > -1) {
            orderItems[existingItemIndex].quantity = quantity;
            orderItems[existingItemIndex].total = quantity * price;
        } else {
            const total = quantity * price;
            orderItems.push({ product, quantity, unit, price, total });
        }
        updateTable();
        saveToLocalStorage();
    }

    function saveToLocalStorage() {
        localStorage.setItem('orderItems', JSON.stringify(orderItems));
    }

    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('input', () => {
            const product = input.getAttribute('data-product');
            const price = parseFloat(input.getAttribute('data-price'));
            const quantity = parseFloat(input.value);

            if (quantity >= 0) {
                updateItem(product, quantity, 'kg', price);
            }
        });
    });

    document.querySelectorAll('.buy-now-button').forEach(button => {
        button.addEventListener('click', (event) => {
            event.preventDefault();
            const product = button.getAttribute('data-product');
            const price = parseFloat(button.getAttribute('data-price'));
            const quantity = parseFloat(button.previousElementSibling.value);

            if (quantity >= 0) {
                updateItem(product, quantity, 'kg', price);
            }
        });
    });

    if (addToFavouritesButton) {
        addToFavouritesButton.addEventListener('click', () => {
            localStorage.setItem('favorites', JSON.stringify(orderItems));
            alert('Order saved as favorites!');
        });
    }

    if (applyFavouritesButton) {
        applyFavouritesButton.addEventListener('click', () => {
            orderItems = JSON.parse(localStorage.getItem('favorites')) || [];
            updateTable();
            alert('Favorites applied to your order!');
        });
    }

    

   
    updateTable();
});

// Checkout page
document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('checkout-form');
    const cartSummaryTable = document.getElementById('cart-summary-table').getElementsByTagName('tbody')[0];
    const totalPriceElem = document.getElementById('total-price');

    function loadCartItems() {
        const cartItems = JSON.parse(localStorage.getItem('orderItems')) || [];
        let total = 0;

        // Clear existing rows
        cartSummaryTable.innerHTML = '';

        cartItems.forEach(item => {
            const row = cartSummaryTable.insertRow();
            row.insertCell(0).textContent = item.product;
            row.insertCell(1).textContent = `${item.quantity} ${item.unit}`;
            row.insertCell(2).textContent = `Rs.${item.total.toFixed(2)}`;
            total += item.total;
        });

        totalPriceElem.textContent = total.toFixed(2);
    }

    loadCartItems();

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            // Get form values
            const fullName = document.getElementById('full-name').value.trim();
            const email = document.getElementById('email').value.trim();
            const address = document.getElementById('address').value.trim();
            const city = document.getElementById('city').value.trim();
            const state = document.getElementById('state').value.trim();
            const zipCode = document.getElementById('zip-code').value.trim();
            const cardName = document.getElementById('card-name').value.trim();
            const cardNumber = document.getElementById('card-number').value.trim();
            const expireMonth = document.getElementById('expire-month').value.trim();
            const expireYear = document.getElementById('expire-year').value.trim();
            const cvv = document.getElementById('cvv').value.trim();

            // Simple validation
            if (!fullName || !email || !address || !city || 
                !state || !zipCode || !cardName || 
                !cardNumber || !expireMonth || 
                !expireYear || !cvv) {
                alert('Please fill out all fields.');
                return; // Prevent form submission if any field is empty
            }

            // Show the success alert if all fields are filled
            alert(`Thank you for your purchase, ${fullName}! Your order of Rs.${totalPriceElem.textContent} will be processed and delivered to ${address}, ${city}, ${state} ${zipCode}.`);
            form.reset(); // Reset form after submission
            localStorage.removeItem('orderItems'); // Clear cart after submission
        });
    }
});
