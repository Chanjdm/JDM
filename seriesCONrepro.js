
    document.addEventListener('DOMContentLoaded', function() {
      const videoContainer = document.getElementById('video-container');
      const closeVideoButton = document.getElementById('close-video');
      const videoPlayer = document.getElementById('video-player');

      function openVideo(videoUrl) {
        videoContainer.style.display = 'block';
        videoPlayer.src = videoUrl;
        videoPlayer.play();
      }

      function closeVideo() {
        videoContainer.style.display = 'none';
        videoPlayer.pause();
        videoPlayer.src = ''; // Limpiar la fuente del reproductor al cerrar
      }

      document.addEventListener('click', function(event) {
        if (event.target.tagName === 'A' && event.target.getAttribute('data-video-url')) {
          event.preventDefault();
          const videoUrl = event.target.getAttribute('data-video-url');
          openVideo(videoUrl);
        }
      });

      closeVideoButton.addEventListener('click', closeVideo);
    });



    // Resto de tu script actual

    function openDialog(index) {
      // ...

      const chapters = document.querySelectorAll('.chapter-menu a');
      chapters.forEach(function(chapter) {
        chapter.classList.remove('selected-chapter');
      });

      // ...
    }

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


