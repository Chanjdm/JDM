  var currentVideoURL = "";

  function playMovie(url) {
    const videoPlayer = document.getElementById('video-player');
    const playerContainer = document.getElementById('player-container');

    videoPlayer.src = url;
    currentVideoURL = url;
    playerContainer.style.display = 'block';
    videoPlayer.play();
  }

  function closePlayer() {
    const videoPlayer = document.getElementById('video-player');
    const playerContainer = document.getElementById('player-container');

    videoPlayer.pause();
    videoPlayer.src = '';
    playerContainer.style.display = 'none';
  }

  function repeatVideo() {
    if (currentVideoURL) {
      const videoPlayer = document.getElementById('video-player');
      videoPlayer.currentTime = 0; // Restart video from the beginning
      videoPlayer.play();
    }
  }




    function searchByTitle() {
      var searchInput = document.getElementById("search-input");
      var searchTerm = searchInput.value.toLowerCase();

      var movieItems = document.getElementsByClassName("movie-item");
      for (var i = 0; i < movieItems.length; i++) {
        var movieTitle = movieItems[i].querySelector(".movie-title");
        var title = movieTitle.innerText.toLowerCase();

        if (title.includes(searchTerm)) {
          movieItems[i].style.display = "inline-block";
        } else {
          movieItems[i].style.display = "none";
        }
      }
    }













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
























  // Deshabilitar la apertura de ventanas emergentes y enlaces externos
  window.addEventListener("beforeunload", function (event) {
    // Detener la apertura de ventanas emergentes
    window.open = function() { return null; };

    // Desactivar todos los enlaces que apunten a páginas externas
    var externalLinks = document.querySelectorAll("a[target='_blank']");
    for (var i = 0; i < externalLinks.length; i++) {
      externalLinks[i].removeAttribute("target");
    }
  });
