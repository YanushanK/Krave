/* This JavaScript code adds a "sticky" class to the header element when the page is scrolled beyond the top, creating a sticky header effect.*/
const header = document.querySelector("header")

window.addEventListener("scroll", function(){
    header.classList.toggle ("sticky", this.window.scrollY > 0);
})

let menu = document.querySelector('#menu-icon');
let navmenu = document.querySelector('.nav-bar');

menu.onclick = () => {
    menu.classList.toggle('bx-x');
    navmenu.classList.toggle('open');
}