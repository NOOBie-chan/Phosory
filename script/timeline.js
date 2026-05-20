const steps = document.querySelectorAll(".card");
const observer = new IntersectionObserver(entries => {
entries.forEach(entry => {
    if (entry.isIntersecting) {
    entry.target.style.opacity = 1;
    entry.target.style.transform = "translateY(0)";
    }
});
});
steps.forEach(step => {
step.style.opacity = 0;
step.style.transform = "translateY(40px)";
step.style.transition = "0.6s ease";
observer.observe(step);
});