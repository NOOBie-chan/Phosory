document.addEventListener("DOMContentLoaded", () => {

  // =========================
  // SIDEBAR TOGGLE
  // =========================
  const sidebar = document.getElementById("sidebar");
  const openMenu = document.getElementById("openMenu");
  const closeMenu = document.getElementById("closeMenu");

  if (openMenu && sidebar) {
    openMenu.addEventListener("click", () => {
      sidebar.classList.add("active");
    });
  }

  if (closeMenu && sidebar) {
    closeMenu.addEventListener("click", () => {
      sidebar.classList.remove("active");
    });
  }

  // =========================
  // MOBILE DROPDOWN
  // =========================
  const mobileBtn = document.getElementById("mobileDropBtn");
  const mobileDropdown = document.getElementById("mobileDropdown");

  if (mobileBtn && mobileDropdown) {
    mobileBtn.addEventListener("click", () => {
      mobileDropdown.classList.toggle("show");
    });
  }

  // =========================
  // ACTIVE PAGE INDICATOR
  // =========================
  const currentPage = window.location.pathname.split("/").pop();

  document.querySelectorAll(".nav-links a, .sidebar a").forEach(link => {
    const href = link.getAttribute("href");

    if (href === currentPage) {
      link.classList.add("active");
    }
  });

});