// ==========================================================
// StudyMate – Client-side script
// Handles flash dismissals, modal shortcuts, and client ergonomics
// ==========================================================

document.addEventListener("DOMContentLoaded", () => {
  // Auto-dismiss flash alerts after 5 seconds
  const alerts = document.querySelectorAll(".flash-alert");
  alerts.forEach(alert => {
    setTimeout(() => {
      alert.style.opacity = "0";
      alert.style.transition = "opacity 0.5s ease";
      setTimeout(() => alert.remove(), 500);
    }, 5000);
  });

  // Close modals on Escape key press
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      const overlays = document.querySelectorAll(".modal-overlay");
      overlays.forEach(overlay => overlay.style.display = "none");
    }
  });

  // Close modal when clicking outside modal box
  const overlays = document.querySelectorAll(".modal-overlay");
  overlays.forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (e.target === overlay) {
        overlay.style.display = "none";
      }
    });
  });
});
