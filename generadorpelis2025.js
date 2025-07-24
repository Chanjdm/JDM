

// Función para abrir el video correctamente según el dispositivo
function openStream(url) {
  localStorage.setItem("scrollY", window.scrollY);

  const userAgent = navigator.userAgent;
  const isAndroid = /Android/i.test(userAgent);
  const isLGSmartTV = /webOS|LG|NetCast/i.test(userAgent);

  if (isAndroid && !isLGSmartTV) {
    // Dispositivos Android: usa intent
    window.location.href = `intent:${url}#Intent;type=video/*;action=android.intent.action.VIEW;end;`;
  } else if (isLGSmartTV) {
    // LG Smart TV: crear reproductor inline
    let videoContainer = document.getElementById('smartTVPlayer');
    if (!videoContainer) {
      videoContainer = document.createElement('div');
      videoContainer.id = 'smartTVPlayer';
      videoContainer.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: black;
        z-index: 999999;
        display: flex;
        align-items: center;
        justify-content: center;
        outline: none;
        border: none;
        overflow: hidden;
      `;
      
      const videoElement = document.createElement('video');
      videoElement.id = 'tvVideoPlayer';
      videoElement.style.cssText = `
        width: 100%;
        height: 100%;
        object-fit: contain;
        outline: none;
        border: none;
        box-shadow: none;
      `;
      videoElement.controls = false; // Desactivamos controles nativos para usar los nuestros
      videoElement.autoplay = true;
      
      const sourceElement = document.createElement('source');
      sourceElement.src = url;
      sourceElement.type = 'video/mp4';
      
      videoElement.appendChild(sourceElement);
      
      // Controles personalizados - Orden: Rojo, Verde, Amarillo, Azul
      const controlsContainer = document.createElement('div');
      controlsContainer.id = 'customControls';
      controlsContainer.style.cssText = `
        position: absolute;
        bottom: 20px;
        left: 0;
        right: 0;
        display: flex;
        justify-content: center;
        gap: 20px;
        z-index: 1000001;
        transition: opacity 0.3s ease;
      `;
      
      // Botón Rojo - Cerrar
      const closeBtn = document.createElement('button');
      closeBtn.innerHTML = '✕';
      closeBtn.style.cssText = `
        background: rgba(255,0,0,0.7);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        outline: none;
      `;
      
      // Botón Verde - Play/Pause
      const playPauseBtn = document.createElement('button');
      playPauseBtn.innerHTML = '▶';
      playPauseBtn.style.cssText = `
        background: rgba(0,255,0,0.7);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        outline: none;
      `;
      
      // Botón Amarillo - Adelantar
      const forwardBtn = document.createElement('button');
      forwardBtn.innerHTML = '⏩';
      forwardBtn.style.cssText = `
        background: rgba(255,255,0,0.7);
        color: black;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        outline: none;
      `;
      
      // Botón Azul - Retroceder
      const rewindBtn = document.createElement('button');
      rewindBtn.innerHTML = '⏪';
      rewindBtn.style.cssText = `
        background: rgba(0,0,255,0.7);
        color: white;
        border: none;
        width: 50px;
        height: 50px;
        border-radius: 50%;
        font-size: 20px;
        cursor: pointer;
        outline: none;
      `;
      
      // Agregar botones en el nuevo orden: Rojo, Verde, Amarillo, Azul
      controlsContainer.appendChild(closeBtn);
      controlsContainer.appendChild(playPauseBtn);
      controlsContainer.appendChild(forwardBtn);
      controlsContainer.appendChild(rewindBtn);
      
      // Información de controles - Actualizada con el nuevo orden
      const infoContainer = document.createElement('div');
      infoContainer.id = 'controlsInfo';
      infoContainer.style.cssText = `
        position: absolute;
        top: 20px;
        left: 20px;
        background: rgba(0,0,0,0.8);
        color: white;
        padding: 15px;
        border-radius: 10px;
        font-family: Arial, sans-serif;
        z-index: 1000002;
        font-size: 14px;
        transition: opacity 0.3s ease;
      `;
      
      infoContainer.innerHTML = `
        <div> Rojo: Cerrar</div>
        <div> Verde: Play/Pause</div>
        <div> Amarillo: +10s</div>
        <div> Azul: -10s</div>
      `;
      
      // Funciones de los botones
      playPauseBtn.onclick = function() {
        if (videoElement.paused) {
          videoElement.play();
          playPauseBtn.innerHTML = '⏸';
        } else {
          videoElement.pause();
          playPauseBtn.innerHTML = '▶';
        }
        resetInfoTimer();
      };
      
      rewindBtn.onclick = function() {
        videoElement.currentTime = Math.max(0, videoElement.currentTime - 10);
        resetInfoTimer();
      };
      
      forwardBtn.onclick = function() {
        videoElement.currentTime = videoElement.currentTime + 10;
        resetInfoTimer();
      };
      
      closeBtn.onclick = function() {
        videoElement.pause();
        document.body.removeChild(videoContainer);
      };
      
      videoContainer.appendChild(videoElement);
      videoContainer.appendChild(controlsContainer);
      videoContainer.appendChild(infoContainer);
      document.body.appendChild(videoContainer);
      
      // Timer para ocultar información y controles
      let infoTimer;
      let controlsVisible = true;
      
      function hideControls() {
        controlsContainer.style.opacity = '0';
        infoContainer.style.opacity = '0';
        controlsVisible = false;
      }
      
      function showControls() {
        controlsContainer.style.opacity = '1';
        infoContainer.style.opacity = '1';
        controlsVisible = true;
      }
      
      function resetInfoTimer() {
        showControls();
        clearTimeout(infoTimer);
        infoTimer = setTimeout(() => {
          if (controlsVisible) {
            hideControls();
          }
        }, 8000);
      }
      
      // Mostrar información al interactuar
      function showInfo() {
        showControls();
        resetInfoTimer();
      }
      
      // Eventos para mostrar información y controles
      videoContainer.addEventListener('mousemove', showInfo);
      videoContainer.addEventListener('keydown', showInfo);
      videoContainer.addEventListener('click', showInfo);
      
      // Controles con teclado del Smart TV - Actualizados con el nuevo orden
      videoContainer.addEventListener('keydown', function(e) {
        switch(e.keyCode) {
          case 403: // Red button - Close
          case 179: // Escape
            e.preventDefault();
            videoElement.pause();
            document.body.removeChild(videoContainer);
            break;
          case 13: // Enter - Play/Pause
          case 404: // Green button - Play/Pause
          case 27: // Green button alternative
            e.preventDefault();
            if (videoElement.paused) {
              videoElement.play();
              playPauseBtn.innerHTML = '⏸';
            } else {
              videoElement.pause();
              playPauseBtn.innerHTML = '▶';
            }
            resetInfoTimer();
            break;
          case 405: // Yellow button - Forward 10s
          case 177: // Yellow button alternative
            e.preventDefault();
            videoElement.currentTime = videoElement.currentTime + 10;
            resetInfoTimer();
            break;
          case 406: // Blue button - Rewind 10s
          case 178: // Blue button alternative
            e.preventDefault();
            videoElement.currentTime = Math.max(0, videoElement.currentTime - 10);
            resetInfoTimer();
            break;
        }
      });
      
      // Hacer focus en el contenedor para recibir eventos de teclado
      videoContainer.tabIndex = -1;
      videoContainer.focus();
      
      // Iniciar timer de información
      resetInfoTimer();
      
      // Forzar la reproducción
      setTimeout(() => {
        videoElement.play().then(() => {
          playPauseBtn.innerHTML = '⏸';
        }).catch(e => console.log('Auto-play prevented:', e));
      }, 100);
    }
  } else {
    // Otros dispositivos: redirigir normalmente
    window.location.href = url;
  }
}

// Navegación con teclado o control remoto
document.addEventListener("DOMContentLoaded", () => {
  const focusables = Array.from(document.querySelectorAll('a[tabindex="0"], a'));
  const watchButton = document.querySelector('a[onclick*="openStream"]'); // Seleccionar el botón "Ver Película"

  // Si existe el botón "Ver Película", hacerle focus
  if (watchButton) {
    watchButton.focus();
  } else if (focusables.length) {
    // Fallback: enfocar el primero disponible
    focusables[0].focus();
  }

  document.addEventListener("keydown", function (event) {
    const currentFocus = document.activeElement;
    const currentIndex = focusables.indexOf(currentFocus);

    if (event.key === "Enter" && currentFocus && currentFocus.tagName === "A") {
      currentFocus.click(); // Simula clic
    }

    if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(event.key)) {
      if (currentIndex === -1) return;

      let nextIndex = currentIndex;
      if (event.key === "ArrowDown" || event.key === "ArrowRight") {
        nextIndex = (currentIndex + 1) % focusables.length;
      } else if (event.key === "ArrowUp" || event.key === "ArrowLeft") {
        nextIndex = (currentIndex - 1 + focusables.length) % focusables.length;
      }

      event.preventDefault();
      focusables[nextIndex].focus();
    }
  });
});
