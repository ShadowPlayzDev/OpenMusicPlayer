      const mainView = document.getElementById("main-view")
      const browseView = document.getElementById("browse-view")
      const playlistsView = document.getElementById("playlists-view")
      const songDetailView = document.getElementById("song-detail-view")
      const trackListContainer = document.getElementById("track-list")
      const audioPlayer = document.getElementById("audio-player")
      const playerTrackTitle = document.getElementById("player-track-title")
      const playerArtistName = document.getElementById("player-artist-name")
      const playerAlbumArt = document.getElementById("player-album-art")
      const hamburgerMenu = document.getElementById("hamburger-menu")
      const sidebar = document.getElementById("sidebar")

      let currentTrack = null
      let musicData = [
        {
          id: "1",
          title: "Song 1",
          artist: "Artist A",
          album: "Album X",
          src: "music/song1.mp3",
          albumArt: "album-art/albumx.jpg",
          detailsPage: "song1.html",
        },
        {
          id: "2",
          title: "Another Song",
          artist: "Band B",
          album: "The Album",
          src: "music/another_song.mp3",
          albumArt: "album-art/thealbum.png",
          detailsPage: "song2.html",
        },
        // ... more songs
      ]

      function loadView(viewId) {
        browseView.style.display = "none"
        playlistsView.style.display = "none"
        songDetailView.style.display = "none"
        document.getElementById(viewId).style.display = "block"
      }

      function playTrack(track) {
        currentTrack = track
        audioPlayer.src = track.src
        playerTrackTitle.textContent = track.title
        playerArtistName.textContent = track.artist
        playerAlbumArt.src = track.albumArt
        audioPlayer.play()
      }

      function displayLibrary() {
        trackListContainer.innerHTML = ""
        musicData.forEach((song) => {
          const listItem = document.createElement("li")
          const link = document.createElement("a")
          link.href = `#song/${song.id}` // Use a hash-based routing approach
          link.textContent = `${song.title} - ${song.artist}`
          listItem.appendChild(link)
          trackListContainer.appendChild(listItem)
        })
      }

      function loadSongDetails(songId) {
        const song = musicData.find((s) => s.id === songId)
        if (song) {
          songDetailView.innerHTML = `
                    <h2>${song.title}</h2>
                    <p>Artist: ${song.artist}</p>
                    <img src="${song.albumArt}" alt="${song.album}" style="width: 200px;">
                    <button onclick="playTrack(musicData.find(s => s.id === '${songId}'))">Play</button>
                    <p><a href="#browse">Back to Browse</a></p>
                `
          loadView("song-detail-view")
        } else {
          songDetailView.innerHTML = "<p>Song not found.</p>"
          loadView("song-detail-view")
        }
      }

      window.addEventListener("hashchange", () => {
        const hash = window.location.hash
        if (hash === "#browse") {
          loadView("browse-view")
        } else if (hash === "#playlists") {
          loadView("playlists-view")
        } else if (hash.startsWith("#song/")) {
          const songId = hash.substring(6)
          loadSongDetails(songId)
        } else {
          loadView("browse-view") // Default view
        }
      })

      hamburgerMenu.addEventListener("click", () => {
        sidebar.classList.toggle("open")
        mainView.classList.toggle("sidebar-open")
      })

      document.addEventListener("DOMContentLoaded", () => {
        displayLibrary()
        loadView("browse-view") // Initial view

        // Check screen width on load and initially hide sidebar if needed
        if (window.innerWidth < 768) {
          sidebar.classList.remove("open")
          mainView.classList.remove("sidebar-open")
        }
      })

      window.addEventListener("resize", () => {
        // Adjust sidebar state on resize
        if (window.innerWidth >= 768) {
          sidebar.classList.add("open")
          mainView.classList.add("sidebar-open")
        } else {
          sidebar.classList.remove("open")
          mainView.classList.remove("sidebar-open")
        }
      })
