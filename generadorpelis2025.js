  // Función para abrir el video correctamente según el dispositivo
  function openStream(url) {
    localStorage.setItem("scrollY", window.scrollY);

    const userAgent = navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isSmartTV = /SmartTV|Tizen|webOS|NetCast|Viera|DTV|HbbTV|CE-HTML/i.test(userAgent);

    if (isAndroid && !isSmartTV) {
      // Android móvil o tablet
      window.location.href = `intent:${url}#Intent;type=video/*;action=android.intent.action.VIEW;end;`;
    } else {
      // Smart TV u otros: reproducir directamente
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