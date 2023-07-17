    function playMovie(movieUrl) {
      var videoPlayer = document.getElementById("video-player");
      videoPlayer.src = movieUrl;
      videoPlayer.play();
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