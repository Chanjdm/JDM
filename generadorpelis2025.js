    // Función para abrir el video correctamente según el dispositivo
function openStream(url) {
  localStorage.setItem("scrollY", window.scrollY);

  const userAgent = navigator.userAgent;
  const isAndroid = /Android/i.test(userAgent);
  const isLGSmartTV = /webOS|LG|NetCast/i.test(userAgent); // detectar LG Smart TV

  if (isAndroid && !isLGSmartTV) {
    // Dispositivos Android: usa intent
    window.location.href = `intent:${url}#Intent;type=video/*;action=android.intent.action.VIEW;end;`;
  } else if (isLGSmartTV) {
    // LG Smart TV: abrir reproductor especial
    const playerWindow = window.open('', '_blank');
    if (playerWindow) {
      playerWindow.document.write(`
        <html>
        <head>
          <title>Reproduciendo en Smart TV</title>
          <style>
            body { margin:0; background:black; display:flex; align-items:center; justify-content:center; height:100vh; }
            video { width:100%; height:auto; }
          </style>
        </head>
        <body>
          <video controls autoplay>
            <source src="${url}" type="video/mp4">
            Tu navegador no soporta reproducción de video.
          </video>
        </body>
        </html>
      `);
      playerWindow.document.close();
    } else {
      alert("No se pudo abrir la ventana del reproductor. Verifica que no esté bloqueada por el navegador.");
    }
  } else {
    // Otros dispositivos: redirigir normalmente
    window.location.href = url;
  }
}


    // Navegación con teclado o control remoto
    document.addEventListener("DOMContentLoaded", () => {
      const focusables = Array.from(document.querySelectorAll('a[tabindex="0"], a'));

      if (focusables.length) focusables[0].focus(); // Enfocar el primero

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