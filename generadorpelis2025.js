    // Función para abrir el video según el dispositivo
    function openStream(url) {
      localStorage.setItem("scrollY", window.scrollY);

      const userAgent = navigator.userAgent;
      const isAndroid = /Android/i.test(userAgent);
      const isLGSmartTV = /webOS|LG|NetCast/i.test(userAgent);

      // 🔧 Activar modo PC para pruebas (true) o (cambiar a false solo en smart)
      const forcePCMode = false;

      if (isAndroid && !isLGSmartTV) {
        // Android: abrir con intent
        window.location.href = `intent:${url}#Intent;type=video/*;action=android.intent.action.VIEW;end;`;
      } else if (isLGSmartTV || forcePCMode) {
        // Reproductor personalizado (LG TV o PC)
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
          videoElement.controls = false;
          videoElement.autoplay = true;

          const source = document.createElement('source');
          source.src = url;
          source.type = 'video/mp4';
          videoElement.appendChild(source);

          // === Botones de colores (Rojo, Verde, Amarillo, Azul) ===
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

          const btnClose = document.createElement('button');
          btnClose.innerHTML = '✕';
          btnClose.style.cssText = `
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

          const btnPlayPause = document.createElement('button');
          btnPlayPause.innerHTML = '▶';
          btnPlayPause.style.cssText = `
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

          const btnForward = document.createElement('button');
          btnForward.innerHTML = '⏩';
          btnForward.style.cssText = `
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

          const btnRewind = document.createElement('button');
          btnRewind.innerHTML = '⏪';
          btnRewind.style.cssText = `
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

          // === Barra de progreso ===
          const progressBarContainer = document.createElement('div');
          progressBarContainer.id = 'progressBarContainer';
          progressBarContainer.style.cssText = `
            position: absolute;
            bottom: 85px;
            left: 5%;
            right: 5%;
            height: 8px;
            background: rgba(255, 255, 255, 0.2);
            border-radius: 4px;
            cursor: pointer;
            z-index: 1000001;
          `;

          const progressBar = document.createElement('div');
          progressBar.id = 'progressBar';
          progressBar.style.cssText = `
            height: 100%;
            width: 0%;
            background: rgba(0, 255, 0, 0.8);
            border-radius: 4px;
            transition: width 0.1s ease;
          `;
          progressBarContainer.appendChild(progressBar);

          // === Tiempos: actual (izq) y duración (der) ===
          const timeContainer = document.createElement('div');
          timeContainer.id = 'timeContainer';
          timeContainer.style.cssText = `
            position: absolute;
            bottom: 70px;
            left: 5%;
            right: 5%;
            display: flex;
            justify-content: space-between;
            color: rgb(255 213 4 / 100%);
            font-family: Arial, sans-serif;
            font-size: 12px;
            z-index: 1000001;
            opacity: 0;
            transition: opacity 0.3s ease;
          `;

          const currentTime = document.createElement('span');
          currentTime.textContent = '00:00';

          const durationTime = document.createElement('span');
          durationTime.textContent = '00:00';

          timeContainer.appendChild(currentTime);
          timeContainer.appendChild(durationTime);

          // Formatear segundos a MM:SS
          function formatTime(seconds) {
            const s = Math.floor(seconds);
            const mins = Math.floor(s / 60);
            const secs = s % 60;
            return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
          }

          function updateTimeDisplay() {
            const current = videoElement.currentTime || 0;
            const duration = videoElement.duration || 0;
            currentTime.textContent = formatTime(current);
            durationTime.textContent = formatTime(duration);
          }

          // === Información de controles ===
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
            <div> Amarillo: +2min</div>
            <div> Azul: -2min</div>
            <div> Barra: Buscar</div>
          `;

          // === Funcionalidad de botones ===
          btnPlayPause.onclick = () => {
            if (videoElement.paused) {
              videoElement.play();
              btnPlayPause.innerHTML = '⏸';
            } else {
              videoElement.pause();
              btnPlayPause.innerHTML = '▶';
            }
            resetControlsTimer();
          };

          btnRewind.onclick = () => {
            videoElement.currentTime = Math.max(0, videoElement.currentTime - 120);
            resetControlsTimer();
          };

          btnForward.onclick = () => {
            videoElement.currentTime += 120;
            resetControlsTimer();
          };

          btnClose.onclick = () => {
            videoElement.pause();
            document.body.removeChild(videoContainer);
          };

          // === Buscar en el video (scrub) ===
          progressBarContainer.addEventListener('click', (e) => {
            const rect = progressBarContainer.getBoundingClientRect();
            const percent = (e.clientX - rect.left) / rect.width;
            videoElement.currentTime = percent * videoElement.duration;
            updateProgressBar();
            updateTimeDisplay();
            resetControlsTimer();
          });

          function updateProgressBar() {
            if (videoElement.duration) {
              const percent = (videoElement.currentTime / videoElement.duration) * 100;
              progressBar.style.width = `${percent}%`;
            }
          }

          // === Control de visibilidad automática ===
          let hideTimer;
          let controlsVisible = true;

          function hideControls() {
            controlsContainer.style.opacity = '0';
            progressBarContainer.style.opacity = '0';
            timeContainer.style.opacity = '0';
            infoContainer.style.opacity = '0';
            controlsVisible = false;
          }

          function showControls() {
            controlsContainer.style.opacity = '1';
            progressBarContainer.style.opacity = '1';
            timeContainer.style.opacity = '1';
            infoContainer.style.opacity = '1';
            controlsVisible = true;
          }

          function resetControlsTimer() {
            showControls();
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => {
              if (controlsVisible) hideControls();
            }, 8000);
          }

          // Mostrar controles al interactuar
          const showOnActivity = () => {
            showControls();
            resetControlsTimer();
          };

          videoContainer.addEventListener('mousemove', showOnActivity);
          videoContainer.addEventListener('click', showOnActivity);
          videoContainer.addEventListener('keydown', showOnActivity);

// === Controles con teclado del Smart TV (versión original corregida) ===
videoContainer.addEventListener('keydown', function(e) {
  switch(e.keyCode) {
    case 403: // Botón Rojo - Cerrar
    case 179: // Escape
      e.preventDefault();
      videoElement.pause();
      document.body.removeChild(videoContainer);
      break;

    case 13:  // Enter
    case 404: // Botón Verde - Play/Pause
    case 27:  // Alternativa Verde
      e.preventDefault();
      if (videoElement.paused) {
        videoElement.play();
        btnPlayPause.innerHTML = '⏸';
      } else {
        videoElement.pause();
        btnPlayPause.innerHTML = '▶';
      }
      resetControlsTimer();
      break;

    case 405: // Botón Amarillo - Adelantar 120 segundos
    case 177: // Alternativa Amarillo
      e.preventDefault();
      videoElement.currentTime = videoElement.currentTime + 120;
      resetControlsTimer();
      break;

    case 406: // Botón Azul - Retroceder 120 segundos
    case 178: // Alternativa Azul
      e.preventDefault();
      videoElement.currentTime = Math.max(0, videoElement.currentTime - 120);
      resetControlsTimer();
      break;
  }
});

          // Actualizar progreso y tiempo
          videoElement.addEventListener('timeupdate', () => {
            updateProgressBar();
            updateTimeDisplay();
          });

          videoElement.addEventListener('loadedmetadata', updateTimeDisplay);
          videoElement.addEventListener('ended', () => {
            progressBar.style.width = '100%';
            updateTimeDisplay();
          });

          // Enfocar contenedor para eventos de teclado
          videoContainer.tabIndex = -1;
          videoContainer.focus();

          // Iniciar temporizador de visibilidad
          resetControlsTimer();

          // Intentar reproducir
          setTimeout(() => {
            videoElement.play().then(() => {
              btnPlayPause.innerHTML = '⏸';
            }).catch(err => console.log('Auto-play bloqueado:', err));
          }, 100);

          // === Añadir todos los elementos al DOM ===
          videoContainer.appendChild(videoElement);
          videoContainer.appendChild(controlsContainer);
          videoContainer.appendChild(progressBarContainer);
          videoContainer.appendChild(timeContainer);
          videoContainer.appendChild(infoContainer);
          document.body.appendChild(videoContainer);

          // Botones
          controlsContainer.appendChild(btnClose);
          controlsContainer.appendChild(btnPlayPause);
          controlsContainer.appendChild(btnForward);
          controlsContainer.appendChild(btnRewind);
        }
      } else {
        // Otros dispositivos: redirigir
        window.location.href = url;
      }
    }

    // Navegación con teclado
    document.addEventListener("DOMContentLoaded", () => {
      const focusables = Array.from(document.querySelectorAll('a[tabindex="0"], a'));
      const watchButton = document.querySelector('a[onclick*="openStream"]');

      if (watchButton) {
        watchButton.focus();
      } else if (focusables.length > 0) {
        focusables[0].focus();
      }

      document.addEventListener("keydown", (e) => {
        const current = document.activeElement;
        const index = focusables.indexOf(current);

        if (e.key === "Enter" && current?.tagName === "A") {
          current.click();
        }

        if (["ArrowDown", "ArrowUp", "ArrowLeft", "ArrowRight"].includes(e.key)) {
          if (index === -1) return;
          e.preventDefault();
          const next = e.key === "ArrowDown" || e.key === "ArrowRight"
            ? (index + 1) % focusables.length
            : (index - 1 + focusables.length) % focusables.length;
          focusables[next].focus();
        }
      });
    });
