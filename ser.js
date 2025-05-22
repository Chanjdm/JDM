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
  const video = document.getElementById('reproductor');
  const links = document.querySelectorAll('.season-content a');

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const url = link.href;

      if (isAndroid) {
        // En Android: usar intent:// para abrir en app externa
        const intentUrl = `intent:${url}#Intent;type=video/*;action=android.intent.action.VIEW;end;`;
        window.location.href = intentUrl;
      } else {
        // En otros dispositivos: usar reproductor en la misma página
        document.body.querySelectorAll('h2, .main-layout, .info-general').forEach(el => el.style.display = 'none');
        video.src = url;
        video.style.display = 'block';
        video.load();
        video.play().catch(err => console.log("Error al reproducir:", err));
      }
    });
  });
});



//  #################   HACER FOCO SELECCIONABLE
document.addEventListener("DOMContentLoaded", () => {
  // Hacer focables todos los enlaces de episodio
  document.querySelectorAll("a").forEach(el => {
    el.setAttribute("tabindex", "0");
  });

  // También <summary> y otros si deseas
  document.querySelectorAll("summary").forEach(el => {
    el.setAttribute("tabindex", "0");
  });

  // Opcional: enfocar automáticamente el primer elemento
  const firstFocusable = document.querySelector("a, select, summary");
  if (firstFocusable) firstFocusable.focus();
});

// Forzar foco con teclas
document.addEventListener("keydown", function (e) {
  const focusable = Array.from(document.querySelectorAll("a, select, summary")).filter(el => el.offsetParent !== null);
  const index = focusable.indexOf(document.activeElement);

  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    const next = focusable[index + 1] || focusable[0];
    next.focus();
    e.preventDefault();
  }

  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    const prev = focusable[index - 1] || focusable[focusable.length - 1];
    prev.focus();
    e.preventDefault();
  }

  if (e.key === "Enter") {
    if (document.activeElement.tagName === "SUMMARY") {
      document.activeElement.click();
    } else if (document.activeElement.tagName === "A") {
      document.activeElement.click();
    }
  }
});



