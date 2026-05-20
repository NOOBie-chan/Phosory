const missionCard = document.getElementById("missionCard");
const visionCard = document.getElementById("visionCard");
document.getElementById("missionBtn").addEventListener("click", () => {
    missionCard.classList.toggle("active");
    visionCard.classList.remove("active");
});
document.getElementById("visionBtn").addEventListener("click", () => {
    visionCard.classList.toggle("active");
    missionCard.classList.remove("active");
});