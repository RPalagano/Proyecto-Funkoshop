const quantity = document.querySelector('#quantity');
const more = document.querySelector('#more');
const less = document.querySelector('#less');

quantity.addEventListener('input', (event) => event.target.value = event.target.value.replace(/[^0-9]/g, ''));
more.addEventListener('click', () => quantity.value = Number(quantity.value) + 1);
less.addEventListener('click', () => {
    if (quantity.value <= 0) {
        quantity.value = 0
    } 
    else {
        quantity.value = Number(quantity.value) - 1
    }
});

