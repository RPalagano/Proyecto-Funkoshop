const menu = document.getElementById('menu');
const close = document.getElementById('menu__close');
const open = document.getElementById('menu__open');


open.addEventListener("click", () => {
    menu.style.display = "flex";
    open.style.display = "none";
});

close.addEventListener("click", () => {
    menu.style.removeProperty("display");
    open.style.removeProperty("display")
});

