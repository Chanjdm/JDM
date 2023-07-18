  var currentVideoURL = "";
    var player;

    function playMovie(url) {
      const playerContainer = document.getElementById('player-container');
      player = new Plyr('#video-player', {
        controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen'],
      });
      
      // Load the new video source
      player.source = {
        type: 'video',
        sources: [
          {
            src: url,
            type: 'video/mp4',
          },
        ],
      };

      playerContainer.style.display = 'block';
      player.play();
    }

    function closePlayer() {
      const playerContainer = document.getElementById('player-container');
      player.pause();
      player.destroy();
      player = null;
      playerContainer.style.display = 'none';
    }

    // Resto del código

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