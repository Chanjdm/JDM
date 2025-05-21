const selector = document.getElementById("temporadaSelector");
const temporadas = document.querySelectorAll(".temporada");

selector.addEventListener("change", function () {
  temporadas.forEach(temp => temp.classList.remove("active"));
  const selected = document.getElementById(this.value);
  if (selected) {
    selected.classList.add("active");
  }
});

document.addEventListener('DOMContentLoaded', () => {
  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isAndroid) {
    const videoLinks = document.querySelectorAll('.season-content a[target="_blank"]');

    videoLinks.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const url = link.href;

        // Construir el esquema intent para Android
        const intentUrl = `intent:${url}#Intent;type=video/*;action=android.intent.action.VIEW;end;`;

        // Forzar la apertura con intent
        window.location.href = intentUrl;
      });
    });
  }
});

