// script.js

// Import data from config.js
import { musicData, albumData } from './config.js';

const mainView = document.getElementById('main-view');
const browseView = document.getElementById('browse-view');
const playlistsView = document.getElementById('playlists-view');
const trackDetailView = document.getElementById('track-detail-view');
const albumDetailView = document.getElementById('album-detail-view');
const trackListContainer = document.getElementById('track-list');
const audioPlayer = document.getElementById('audio-player');
const playerTrackTitle = document.getElementById('player-track-title');
const playerArtistName = document.getElementById('player-artist-name');
const playerAlbumArt = document.getElementById('player-album-art');
const hamburgerMenu = document.getElementById('hamburger-menu');
const sidebar = document.getElementById('sidebar');

function loadView(viewId) {
    browseView.classList.add('hidden');
    playlistsView.classList.add('hidden');
    trackDetailView.classList.add('hidden');
    albumDetailView.classList.add('hidden');
    document.getElementById(viewId).classList.remove('hidden');
}

function playTrack(trackId) {
    const currentTrack = musicData.find(t => t.id === trackId);
    if (currentTrack) {
        audioPlayer.src = currentTrack.src;
        playerTrackTitle.textContent = currentTrack.title;
        playerArtistName.textContent = currentTrack.artist;
        playerAlbumArt.src = currentTrack.albumArt;
        audioPlayer.play();
    }
}

function displayLibrary() {
    trackListContainer.innerHTML = '';
    musicData.forEach(song => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `#track/${song.id}`; // Link to the song's detail page using UUID
        link.textContent = `${song.title} - ${song.artist}`;
        link.classList.add('block', 'hover:text-white');
        listItem.appendChild(link);

        const playButton = document.createElement('button');
        playButton.innerHTML = '<i class="material-icons ml-2 align-middle">play_arrow</i>';
        playButton.classList.add('text-gray-400', 'hover:text-green-500', 'focus:outline-none', 'align-middle');
        playButton.addEventListener('click', () => playTrack(song.id));

        listItem.appendChild(playButton);
        trackListContainer.appendChild(listItem);
    });
}

function loadTrackDetails(trackId) {
    const song = musicData.find(s => s.id === trackId);
    if (song) {
        trackDetailView.innerHTML = `
            <div class="track-detail text-white">
                <img src="${song.albumArt}" alt="${song.album}" class="cover-art w-48 h-48 rounded shadow-md mb-4 object-cover">
                <h2 class="text-3xl font-bold mb-2">${song.title}</h2>
                <p class="artist text-gray-400 text-lg mb-1">Artist: ${song.artist}</p>
                <p class="album text-gray-400 text-lg mb-4">Album: <a href="#album/${song.albumId}" class="text-green-500 hover:underline">${song.album}</a></p>
                <button onclick="playTrack('${trackId}')" class="bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-6 rounded-full">Play</button>
                <p class="mt-4"><a href="#browse" class="text-gray-400 hover:text-white">Back to Browse</a></p>
            </div>
        `;
        loadView('track-detail-view');
    } else {
        trackDetailView.innerHTML = '<p class="text-white">Track not found.</p>';
        loadView('track-detail-view');
    }
}

function loadAlbumDetails(albumId) {
    const album = albumData.find(a => a.id === albumId);
    if (album) {
        const albumTracks = musicData.filter(song => song.albumId === albumId);
        let trackListHTML = '<ul class="space-y-2">';
        albumTracks.forEach(track => {
            trackListHTML += `<li><a href="#track/${track.id}" class="block hover:text-white">${track.title} - ${track.artist}</a></li>`;
        });
        trackListHTML += '</ul>';

        albumDetailView.innerHTML = `
            <div class="album-detail text-white">
                <img src="${album.coverArt}" alt="${album.name}" class="cover-art w-64 h-64 rounded shadow-md mb-4 object-cover">
                <h2 class="text-3xl font-bold mb-2">${album.name}</h2>
                <p class="text-gray-300 leading-relaxed mb-6">Artist: ${album.artist}</p>
                <p class="text-gray-300 leading-relaxed mb-6">Release Year: ${album.releaseYear}</p>
                <h3 class="text-xl font-semibold mb-2">Tracks (${albumTracks.length})</h3>
                ${trackListHTML}
                <p class="mt-4"><a href="#browse" class="text-gray-400 hover:text-white">Back to Browse</a></p>
            </div>
        `;
        loadView('album-detail-view');
    } else {
        albumDetailView.innerHTML = '<p class="text-white">Album not found.</p>';
        loadView('album-detail-view');
    }
}

window.addEventListener('hashchange', () => {
    const hash = window.location.hash;
    if (hash === '#browse') {
        loadView('browse-view');
    } else if (hash === '#playlists') {
        loadView('playlists-view');
    } else if (hash.startsWith('#track/')) {
        const trackId = hash.substring(7);
        loadTrackDetails(trackId);
    } else if (hash.startsWith('#album/')) {
        const albumId = hash.substring(7);
        loadAlbumDetails(albumId);
    } else {
        loadView('browse-view'); // Default view
    }
});

hamburgerMenu.addEventListener('click', () => {
    sidebar.classList.toggle('-translate-x-full');
    mainView.classList.toggle('md:pl-64');
    mainView.classList.toggle('pl-0');
});

document.addEventListener('DOMContentLoaded', () => {
    displayLibrary();
    loadView('browse-view'); // Initial view

    // Check screen width on load and initially hide sidebar if needed (Tailwind handles this with md:translate-x-0)
    if (window.innerWidth < 768) {
        mainView.classList.remove('md:pl-64');
        mainView.classList.add('pl-0');
    }
});

window.addEventListener('resize', () => {
    // Adjust sidebar state on resize (Tailwind handles the default open state on md screens)
    if (window.innerWidth >= 768) {
        sidebar.classList.remove('-translate-x-full');
        mainView.classList.add('md:pl-64');
        mainView.classList.remove('pl-0');
    } else {
        mainView.classList.remove('md:pl-64');
        mainView.classList.add('pl-0');
        if (!sidebar.classList.contains('-translate-x-full')) {
            sidebar.classList.add('-translate-x-full');
        }
    }
});
