
const cards = document.querySelectorAll('.card');
const container = document.querySelector('.cards');
const section = document.querySelector('.morph-section');
const title = document.querySelector('.title');
function randomizeCards() {
const width = container.offsetWidth;
const height = container.offsetHeight;
cards.forEach(card => {
    const cardWidth = card.offsetWidth;
    const cardHeight = card.offsetHeight;
    const x = Math.random() * (width - cardWidth);
    const y = Math.random() * (height - cardHeight);
    const r = (Math.random() * 20) - 10;
    card.style.left = x + "px";
    card.style.top = y + "px";
    card.style.transform = "rotate(${r}deg)";
});
}
function alignToGrid() {
const width = container.offsetWidth;
const isMobile = window.innerWidth < 600;
const cols = isMobile ? 2 : 4;
const gap = isMobile ? 16 : 40;
const cardWidth = cards[0].offsetWidth;
const totalWidth = cols * cardWidth + (cols - 1) * gap;
const startX = (width - totalWidth) / 2;
cards.forEach((card, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const x = startX + col * (cardWidth + gap);
    const totalRows = Math.ceil(cards.length / cols);
    const gridHeight = totalRows * card.offsetHeight + (totalRows - 1) * gap;
    const startY = (container.offsetHeight - gridHeight) / 2;
    const y = startY + row * (card.offsetHeight + gap);
    setTimeout(() => {
        card.style.left = x + "px";
        card.style.top = y + "px";
        card.style.transform = "rotate(0deg) scale(1.05)";
    }, i * 60)
});
}
randomizeCards();
window.addEventListener('resize', () => {
randomizeCards();
});
let isAligned = false;
window.addEventListener('scroll', () => {
    const rect = section.getBoundingClientRect();
    const inView = rect.top <= 0 && rect.bottom >= window.innerHeight * 0.5;
    if (inView && !isAligned){
        alignToGrid();
        title.textContent = "The Solution";
        container.classList.add('active');
        isAligned = true;
    }
    if(!inView && isAligned){
        randomizeCards();
        title.textContent = "The Problem";
        container.classList.remove('active');
        isAligned = false;
    }
});
