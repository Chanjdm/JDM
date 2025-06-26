  window.onload = function () {
    const sesionActiva = localStorage.getItem("sesionActiva");

    if (!sesionActiva) {
      window.location.href = "https://soloyo05.github.io/ser/va.mp4"; // Redirigir al login
    }
  };



const selector = document.getElementById("temporadaSelector");
const temporadas = document.querySelectorAll(".temporada");

let episodeLinks = [];
let currentEpisodeIndex = 0;
let currentVideo = null;
let infoOverlay = null;
let hideInfoTimeout = null;

// Cambio de temporada
selector.addEventListener("change", function () {
  temporadas.forEach(temp => temp.classList.remove("active"));
  const selected = document.getElementById(this.value);
  if (selected) {
    selected.classList.add("active");
    episodeLinks = Array.from(selected.querySelectorAll('.season-content a'));
  }
});

function openStream(url) {
  const isAndroid = /Android/i.test(navigator.userAgent);

  if (isAndroid) {
    const intentUrl = `intent:${url}#Intent;type=video/*;action=android.intent.action.VIEW;end;`;
    window.location.href = intentUrl;
    return;
  }

  let existingPlayer = document.getElementById('streamPlayer');
  if (existingPlayer) existingPlayer.remove();

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

  const video = document.createElement('video');
  video.src = url;
  video.controls = true;
  video.autoplay = true;
  video.style.width = '100%';
  video.style.objectFit = 'contain';
  video.style.backgroundColor = 'black';

  const closeBtn = document.createElement('button');
  closeBtn.textContent = '✖';
  closeBtn.style.position = 'absolute';

  closeBtn.style.top = '0px';
  closeBtn.style.right = '10px';
  closeBtn.style.fontSize = '2rem';
  closeBtn.style.background = 'rgb(0 0 0 / 25%)';
  closeBtn.style.color = '#ffffff52';
  closeBtn.style.border = 'none';
  closeBtn.style.cursor = 'pointer';
  closeBtn.onclick = () => {
    container.remove();
    restoreFocus();
  };

  container.appendChild(video);
  container.appendChild(closeBtn);
  document.body.appendChild(container);

  // --- Agregar listeners solo en el contenedor para mostrar info al interactuar ---
  ['mousemove', 'keydown'].forEach(event => {
    container.addEventListener(event, showInfoOverlay);
  });

  // Mostrar la info inicialmente cuando se abre el video
  showInfoOverlay();
}

// Restaurar foco
function restoreFocus() {
  setTimeout(() => {
    const firstLink = document.querySelector('.season-content a');
    if (firstLink) firstLink.focus();
  }, 300);
}

document.addEventListener('DOMContentLoaded', () => {
  episodeLinks = Array.from(document.querySelectorAll('.season-content a'));
  restoreFocus();

  document.querySelectorAll("a, summary").forEach(el => {
    el.setAttribute("tabindex", "0");
  });

  const firstFocusable = document.querySelector("a, select, summary");
  if (firstFocusable) firstFocusable.focus();
});

document.addEventListener('focusout', () => {
  setTimeout(() => {
    if (!document.activeElement || document.activeElement === document.body) {
      restoreFocus();
    }
  }, 200);
});

// Navegación con teclado
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
    if (document.activeElement.tagName === "SUMMARY" || document.activeElement.tagName === "A") {
      document.activeElement.click();
    }
  }
});

// Mostrar overlay de ayuda
function showInfoOverlay() {
  if (!infoOverlay) {
    infoOverlay = document.createElement('div');
    Object.assign(infoOverlay.style, {
      position: 'fixed',
      top: '0',
      left: '0',
      width: '96%',
      padding: '5px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      zIndex: '10000',
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      lineHeight: '1.6'
    });
    infoOverlay.innerHTML = `

      🔴 Rojo Abrir/Cerrar reproductor|
      🟢 Verde Pausar/Reanudar|
      🟡 Amarillo Retroceder 10s|
      🔵 Azul Avanzar 10s|
      Canal + Siguiente episodio|
      Canal - Episodio anterior
    `;
    document.body.appendChild(infoOverlay);
  }
  infoOverlay.style.display = 'block';

  if (hideInfoTimeout) clearTimeout(hideInfoTimeout);
  hideInfoTimeout = setTimeout(() => {
    if (infoOverlay) infoOverlay.style.display = 'none';
  }, 8000);
}

// Reproducir episodio por índice
function playEpisode(index) {
  if (index >= 0 && index < episodeLinks.length) {
    currentEpisodeIndex = index;
    const url = episodeLinks[index].getAttribute('onclick').match(/'(.*?)'/)[1];
    openStream(url);
  }
}

// Teclas del control remoto
document.addEventListener('keydown', function (e) {
  const video = document.querySelector('#streamPlayer video');
  if (!video && ![403].includes(e.keyCode)) return;

  currentVideo = video;
  showInfoOverlay();

  switch (e.keyCode) {
    case 33: // Canal +
      playEpisode(currentEpisodeIndex + 1);
      break;
    case 34: // Canal -
      playEpisode(currentEpisodeIndex - 1);
      break;
    case 403: // 🔴 Rojo
 case 82:  // Tecla 'R' en teclado
      const container = document.getElementById('streamPlayer');
      if (container) {
        container.remove();
        restoreFocus();
      } else {
        playEpisode(currentEpisodeIndex);
      }
      break;
    case 404: // 🟢 Verde
case 71:  // Tecla G
      if (video.paused) {
        video.play();
      } else {
        video.pause();
      }
      break;
    case 405: // 🟡 Amarillo
      video.currentTime = Math.max(0, video.currentTime - 10);
      break;
    case 406: // 🔵 Azul
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
      break;
  }
});


