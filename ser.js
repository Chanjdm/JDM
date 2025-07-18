
  const selector = document.getElementById("temporadaSelector");
  const temporadas = document.querySelectorAll(".temporada");

  let episodeLinks = [];
  let currentEpisodeIndex = 0;
  let currentVideo = null;
  let infoOverlay = null;
  let hideInfoTimeout = null;
  let lastFocusedEpisode = null;


 // ================================
  // FUNCIÓN toggleFullscreen()
  // ================================
  function toggleFullscreen() {
    const container = document.getElementById("streamPlayer");
    if (!container) return;

    const isInFullScreen = !!(document.fullscreenElement || document.webkitFullscreenElement || document.mozFullScreenElement || document.msFullscreenElement);

    if (!isInFullScreen) {
      if (container.requestFullscreen) {
        container.requestFullscreen();
      } else if (container.webkitRequestFullscreen) {
        container.webkitRequestFullscreen();
      } else if (container.mozRequestFullScreen) {
        container.mozRequestFullScreen();
      } else if (container.msRequestFullscreen) {
        container.msRequestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      } else if (document.webkitExitFullscreen) {
        document.webkitExitFullscreen();
      } else if (document.mozCancelFullScreen) {
        document.mozCancelFullScreen();
      } else if (document.msExitFullscreen) {
        document.msExitFullscreen();
      }
    }
  }



  // Función para mostrar información del episodio
function showEpisodeInfo(title, image, seasonNumber = 1) {
  if (!infoOverlay) {
    infoOverlay = document.createElement('div');
    Object.assign(infoOverlay.style, {
      position: 'absolute',
      top: '10px',
      left: '10px',
      background: 'rgba(0, 0, 0, 0.7)',
      color: 'white',
      padding: '10px',
      borderRadius: '8px',
      zIndex: '10001',
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      display: 'flex',
      flexDirection: 'column',
      gap: '5px'
    });
    document.body.appendChild(infoOverlay);
  }

  infoOverlay.innerHTML = `
    <img src="${image}" alt="Portada" style="width: 80px; border-radius: 4px;">
    <strong>T${seasonNumber}: ${title}</strong>
    <small>➖ Canal - Cap Ant | ➕ Canal + Cap Sig</small>
    <small>🟢 Play/Pause | 🔵 ⏪ -10s | 🟡 ⏩ +10s</small>
    <small>🔴 Rojo Salir | Tecla 0 Pantalla Completa</small>
  `;
  infoOverlay.style.display = 'flex';

  clearTimeout(hideInfoTimeout);
  hideInfoTimeout = setTimeout(() => {
    infoOverlay.style.display = 'none';
  }, 8000);
}
  // Cambio de temporada
selector.addEventListener("change", function () {
  temporadas.forEach(temp => temp.classList.remove("active"));
  const selected = document.getElementById(this.value);
  if (selected) {
    selected.classList.add("active");
    episodeLinks = Array.from(selected.querySelectorAll('.season-content a'));
    currentEpisodeIndex = 0;

    const serieId = window.location.href.split('/').pop().replace('.html', '');
    const ultimoIndice = localStorage.getItem(`ultimoCapitulo_${serieId}`);
    if (ultimoIndice !== null) {
      currentEpisodeIndex = parseInt(ultimoIndice);
      lastFocusedEpisode = episodeLinks[currentEpisodeIndex];
    }

    if (episodeLinks.length > 0) {
      episodeLinks[0].focus();
    }
  }
});

  // Función para abrir un episodio
  function openStream(url) {
    const isAndroid = /Android/i.test(navigator.userAgent);
    if (isAndroid) {
      const intentUrl = `intent:${url}#Intent;type=video/*;action=android.intent.action.VIEW;end;`;
      window.location.href = intentUrl;
      return;
    }

const episodeElement = document.querySelector(`a[onclick*='${url.split('/').pop()}']`);
let title = 'Episodio desconocido';
let image = 'https://via.placeholder.com/100x60?text=Sin+Imagen';
let seasonNumber = 1;

if (episodeElement) {
  const container = episodeElement.closest('div');
  if (container) {
    const strong = container.querySelector('strong');
    if (strong) title = strong.textContent.trim();

    const img = container.querySelector('img');
    if (img && img.src) image = img.src;
    
    // Obtener el número de temporada del selector
    const selectedSeasonId = document.querySelector(".temporada.active")?.id || "temporada-1";
    seasonNumber = selectedSeasonId.replace(/[^0-9]/g, '') || 1;
  }
}

    const existingPlayer = document.getElementById('streamPlayer');
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
    video.style.width = 'auto';
    video.style.height = '100%';
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

    showEpisodeInfo(title, image, seasonNumber);

    ['mousemove', 'keydown', 'click'].forEach(event => {
      container.addEventListener(event, () => {
        if (infoOverlay && infoOverlay.style.display !== 'flex') {
          showEpisodeInfo(title, image);
        }
      });
    });

    if (hideInfoTimeout) clearTimeout(hideInfoTimeout);
    hideInfoTimeout = setTimeout(() => {
      if (infoOverlay) infoOverlay.style.display = 'none';
    }, 8000);
  }

  function restoreFocus() {
    setTimeout(() => {
      if (lastFocusedEpisode && document.body.contains(lastFocusedEpisode)) {
        lastFocusedEpisode.focus();
      } else if (episodeLinks.length > 0) {
        episodeLinks[0].focus();
      }
    }, 300);
  }

document.addEventListener('DOMContentLoaded', () => {
  episodeLinks = Array.from(document.querySelectorAll('.season-content a'));
  document.querySelectorAll("a, summary").forEach(el => el.setAttribute("tabindex", "0"));

  const firstFocusable = document.querySelector("a, select, summary");
  if (firstFocusable) firstFocusable.focus();

  const serieId = window.location.href.split('/').pop().replace('.html', '');
  const ultimoIndice = localStorage.getItem(`ultimoCapitulo_${serieId}`);

  if (ultimoIndice !== null) {
    currentEpisodeIndex = parseInt(ultimoIndice);
    lastFocusedEpisode = episodeLinks[currentEpisodeIndex];
  } else if (episodeLinks.length > 0) {
    currentEpisodeIndex = 0;
    episodeLinks[0].focus();
  }
});

  document.addEventListener('focusout', () => {
    setTimeout(() => {
      if (!document.activeElement || document.activeElement === document.body) {
        restoreFocus();
      }
    }, 200);
  });

  function playEpisode(index) {
    if (index >= 0 && index < episodeLinks.length) {
      currentEpisodeIndex = index;
      lastFocusedEpisode = episodeLinks[index];

      const serieId = window.location.href.split('/').pop().replace('.html', '');
      localStorage.setItem(`ultimoCapitulo_${serieId}`, index);

      const url = episodeLinks[index].getAttribute('onclick').match(/'(.*?)'/)[1];
      openStream(url);
    }
  }

  // ================================
  // EVENTO KEYDOWN MEJORADO Y ROBUSTO
  // ================================


document.addEventListener("keydown", function (e) {
  const focusable = Array.from(document.querySelectorAll("a, select, summary")).filter(
    (el) => el.offsetParent !== null
  );
  const index = focusable.indexOf(document.activeElement);
  const video = document.querySelector("#streamPlayer video");

  // Navegación por menú con flechas
  if (e.key === "ArrowDown" || e.key === "ArrowRight") {
    const next = focusable[index + 1] || focusable[0];
    next.focus();
    e.preventDefault();
    return;
  }
  if (e.key === "ArrowUp" || e.key === "ArrowLeft") {
    const prev = focusable[index - 1] || focusable[focusable.length - 1];
    prev.focus();
    e.preventDefault();
    return;
  }
  if (e.key === "Enter") {
    if (
      document.activeElement.tagName === "SUMMARY" ||
      document.activeElement.tagName === "A"
    ) {
      document.activeElement.click();
      if (document.activeElement.tagName === "A") {
        lastFocusedEpisode = document.activeElement;
        currentEpisodeIndex = episodeLinks.indexOf(document.activeElement);
        if (currentEpisodeIndex !== -1) {
          playEpisode(currentEpisodeIndex);
        }
      }
    }
    return;
  }

  // Si NO hay video abierto, solo permitimos usar la tecla roja
  if (!video) {
    if (e.keyCode === 403) {
      playEpisode(currentEpisodeIndex);
    }
    return;
  }

  // Mostrar info del reproductor
  showEpisodeInfo(
    infoOverlay ? infoOverlay.querySelector('strong').textContent : 'Episodio desconocido',
    infoOverlay ? infoOverlay.querySelector('img').src : ''
  );

  // Detectar teclas del reproductor
  const keyCode = e.keyCode;
  const key = e.key.toLowerCase();
  const code = e.code.toLowerCase();

  switch (true) {
    case keyCode === 48 || keyCode === 96: // Tecla "0" (normal o numérica)
      toggleFullscreen();
      break;

    case keyCode === 33 || keyCode === 109 || keyCode === 189: // Canal - / Tecla -
      playEpisode(currentEpisodeIndex - 1);
      break;

    case keyCode === 34 || keyCode === 107 || keyCode === 187: // Canal + / Tecla +
      playEpisode(currentEpisodeIndex + 1);
      break;

    case keyCode === 403 || keyCode === 82: // Rojo / R
      const container = document.getElementById("streamPlayer");
      if (container) {
        container.remove();
        restoreFocus();
      } else {
        playEpisode(currentEpisodeIndex);
      }
      break;

    case keyCode === 404 || keyCode === 71: // Verde / G
      if (video.paused) video.play();
      else video.pause();
      break;

    case keyCode === 405 || keyCode === 89: // Amarillo / Y
      video.currentTime = Math.max(0, video.currentTime - 10);
      break;

    case keyCode === 406 || keyCode === 66: // Azul / B
      video.currentTime = Math.min(video.duration, video.currentTime + 10);
      break;
  }
});




