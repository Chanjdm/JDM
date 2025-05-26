const selector = document.getElementById("temporadaSelector");
const temporadas = document.querySelectorAll(".temporada");

selector.addEventListener("change", function () {
  temporadas.forEach(temp => temp.classList.remove("active"));
  const selected = document.getElementById(this.value);
  if (selected) {
    selected.classList.add("active");
  }
});

function openStream(url) {
  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isAndroid) {
    // En Android, redirige usando intent://
    const intentUrl = `intent:${url}#Intent;type=video/*;action=android.intent.action.VIEW;end;`;
    window.location.href = intentUrl;
    return;
  }

  // Elimina si ya existe un reproductor anterior
  let existingPlayer = document.getElementById('streamPlayer');
  if (existingPlayer) existingPlayer.remove();

  // Crear contenedor del reproductor
  const container = document.createElement('div');
  container.id = 'streamPlayer';
  container.style.position = 'fixed';
  container.style.top = '0';
  container.style.left = '0';
  container.style.width = '100vw';
  container.style.height = '100vh';
  container.style.backgroundColor = 'black';
  container.style.zIndex = '9999';
  container.style.display = 'flex';
  container.style.justifyContent = 'center';
  container.style.alignItems = 'center';

  // Crear el reproductor de video
  const video = document.createElement('video');
  video.src = url;
  video.controls = true;
  video.autoplay = true;
video.style.width = '100%';
video.style.objectFit = 'contain'; // o 'cover' si quieres que llene aunque recorte
  video.style.backgroundColor = 'black';

  // Botón para cerrar el reproductor
  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✖';
  closeBtn.style.position = 'absolute';
  closeBtn.style.top = '10px';
  closeBtn.style.right = '10px';
  closeBtn.style.fontSize = '2rem';
  closeBtn.style.background = 'rgba(0,0,0,0.5)';
  closeBtn.style.color = 'white';
  closeBtn.style.border = 'none';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = () => {
    container.remove();
    restoreFocus(); // ✅ recupera el foco automáticamente
  };

  container.appendChild(video);
  container.appendChild(closeBtn);
  document.body.appendChild(container);
}

// ✅ Función para restaurar el foco en el primer capítulo
function restoreFocus() {
  setTimeout(() => {
    const firstLink = document.querySelector('.season-content a');
    if (firstLink) firstLink.focus();
  }, 300);
}

// ✅ Restaurar foco al cargar o si se pierde por error
document.addEventListener('DOMContentLoaded', restoreFocus);
document.addEventListener('focusout', () => {
  setTimeout(() => {
    if (!document.activeElement || document.activeElement === document.body) {
      restoreFocus();
    }
  }, 200);
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



