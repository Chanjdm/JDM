
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
  </script>

  <script>
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

    /* PONER MAS PAGINAS  ######################################################   */

    const pageLinks = [
      { number: 1, link: 'go:SERIESTUX' },
      { number: 2, link: 'go:SERIESTUXA' },
      { number: 3, link: 'go:SERIESTUXB' },
      { number: 4, link: 'go:SERIESTUXC' },
      { number: 5, link: 'go:SERIESTUXD' },
      { number: 6, link: 'go:SERIESTUXE' },
      { number: 7, link: 'go:SERIESTUXF' },
      { number: 8, link: 'go:SERIESTUXG' },
      { number: 9, link: 'go:SERIESTUXH' },
      { number: 10, link: 'go:SERIESTUXI' },
      { number: 11, link: 'go:SERIESTUXJ' },
      { number: 12, link: 'go:SERIESTUXK' },
      { number: 13, link: 'go:SERIESTUXL' },
      { number: 14, link: 'go:SERIESTUXM' },
      { number: 15, link: 'go:SERIESTUXN' },
      { number: 16, link: 'go:SERIESTUXO' },
      { number: 17, link: 'go:SERIESTUXP' },
      { number: 18, link: 'go:SERIESTUXQ' },
      { number: 19, link: 'go:SERIESTUXR' },
      { number: 20, link: 'go:SERIESTUXS' },
      { number: 21, link: 'go:SERIESTUXT' },
      { number: 22, link: 'go:SERIESTUXU' },
      { number: 23, link: 'go:SERIESTUXV' },
      { number: 24, link: 'go:SERIESTUXW' },
      { number: 25, link: 'go:SERIESTUXX' },
      { number: 26, link: 'go:SERIESTUXY' },
      { number: 27, link: 'go:SERIESTUXZ' },
      // Agrega más objetos para cada página con sus enlaces
    ];

    const pageNumbersContainer = document.querySelector('.page-numbers');
    const prevButton = document.querySelector('.prev-btn');
    const nextButton = document.querySelector('.next-btn');

    let currentPage = 1;

    function updatePageNumbers() {
      pageNumbersContainer.innerHTML = '';

      for (const pageLink of pageLinks) {
        const pageNumber = document.createElement('a');
        pageNumber.textContent = pageLink.number;
        pageNumber.href = pageLink.link;
        pageNumber.classList.add('page-number');

        if (pageLink.number === currentPage) {
          pageNumber.classList.add('active');
        }

        pageNumber.addEventListener('click', () => {
          currentPage = pageLink.number;
          updatePageNumbers();
        });

        pageNumbersContainer.appendChild(pageNumber);
      }
    }

    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updatePageNumbers();
      }
    });

    nextButton.addEventListener('click', () => {
      if (currentPage < pageLinks.length) {
        currentPage++;
        updatePageNumbers();
      }
    });

    updatePageNumbers();