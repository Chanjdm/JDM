

        var codigoCorrecto = "51078"; // Cambia "miCodigoSecreto" por tu código de acceso
        var tiempoDuracion = 24 * 60 * 60 * 1000; // 24 horas en milisegundos

        function verificarCodigo() {
            var codigoIngresado = document.getElementById("clave").value;

            if (codigoIngresado === codigoCorrecto) {
                localStorage.setItem("accesoConcedido", "true");
                mostrarContenido();
            } else {
                alert("Código incorrecto. Intenta de nuevo.");
                document.getElementById("clave").value = "";
            }
        }

        function mostrarContenido() {
            document.getElementById("formulario").style.display = "none";
            document.getElementById("contenido").style.display = "block";
            setTimeout(cerrarSesion, tiempoDuracion); // Configurar el temporizador para cerrar la sesión
        }

        function cerrarSesion() {
            localStorage.removeItem("accesoConcedido");
            document.getElementById("contenido").style.display = "none";
            document.getElementById("formulario").style.display = "block";
            document.getElementById("clave").value = "";
        }

        // Comprobar si la sesión está activa al cargar la página
        window.onload = function() {
            var accesoConcedido = localStorage.getItem("accesoConcedido");
            if (accesoConcedido === "true") {
                mostrarContenido();
            } else {
                cerrarSesion();
            }
        }


















document.addEventListener('click', function(event) {
  const link = event.target;
  if (link.tagName === 'A' && link.href.startsWith('http')) {
    event.preventDefault();
    const videoUrl = link.href;
    const videoPlayer = document.createElement('video');
    videoPlayer.src = videoUrl;
    videoPlayer.width = '560';
    videoPlayer.height = '315';
    videoPlayer.controls = true;
    videoPlayer.style.position = 'fixed';
    videoPlayer.style.top = '33%';
    videoPlayer.style.left = '30%';
    videoPlayer.style.border = 'none';
    videoPlayer.style.zIndex = '9999';
    videoPlayer.id = 'video-player';

    const closeButton = document.getElementById('close-player');
    closeButton.style.display = 'block';
    closeButton.addEventListener('click', function() {
      videoPlayer.pause();
      videoPlayer.remove();
      closeButton.style.display = 'none';
    });

    document.body.appendChild(videoPlayer);
  }
});














































document.addEventListener('DOMContentLoaded', function() {
  const series = document.querySelectorAll('.serie');
  const dialogBox = document.getElementById('dialog-box');
  const closeButton = document.querySelector('.close-button');

  series.forEach(function(serie) {
    serie.addEventListener('click', function() {
      dialogBox.classList.add('open');

      const serieInfo = serie.querySelector('.serie-info');
      const serieTitle = serieInfo.querySelector('h2').textContent;
      const seasonsDialog = document.querySelector('.seasons-dialog');
      seasonsDialog.innerHTML = '';

      const seasons = serie.querySelectorAll('.seasons');
      seasons.forEach(function(season) {
        const seasonButton = season.querySelector('.season-button');
        const chapterMenu = season.querySelector('.chapter-menu');
        const chapterLinks = chapterMenu.querySelectorAll('a');

        seasonButton.addEventListener('click', function() {
          chapterMenu.classList.toggle('hidden');
        });

        const clonedSeason = season.cloneNode(true);
        clonedSeason.classList.remove('hidden'); // Mostrar temporada al hacer clic en la imagen
        seasonsDialog.appendChild(clonedSeason);
      });
    });
  });

 closeButton.addEventListener('click', function(event) {
        event.preventDefault();
        dialogBox.classList.remove('open');
  });
});














