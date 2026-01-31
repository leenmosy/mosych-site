function setFullHeight() {
    document.documentElement.style.setProperty('--app-height', `${window.innerHeight}px`);
}

window.addEventListener('resize', setFullHeight);
window.addEventListener('load', setFullHeight);

const messages = [
    "Initializing…",
    "Loading resources…",
    "Setting up interface…",
    "Almost ready…"
];

const statusEl = document.getElementById("status");
let index = 0;

setInterval(() => {
    index = (index + 1) % messages.length;
    statusEl.textContent = messages[index];
}, 3000);
