const btnBuscar = document.getElementById("btnBuscar");
const campoBusqueda = document.getElementById("campoBusqueda");
const resultados = document.getElementById("resultados");
const caratulaAlbum = document.getElementById("caratulaAlbum");
const playlist = document.getElementById("playlist");

btnBuscar.addEventListener("click", buscarCanciones);
campoBusqueda.addEventListener("keypress", (e) => {
    if (e.key === "Enter") buscarCanciones();
});

// Limpiar resultados al borrar texto
campoBusqueda.addEventListener("input", () => {
    if (!campoBusqueda.value.trim()) {
        resultados.innerHTML = "";  
    }
});

function buscarCanciones() {
    const query = campoBusqueda.value.trim();

    // Limpiar resultados si no hay texto
    if (!query) {
        resultados.innerHTML = "";  
        return alert("¡Escribe algo!");
    }

    resultados.innerHTML = "<p class='text-center'>Buscando...</p>";

    const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&output=jsonp&callback=procesarResultados`;

    const script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);
}

window.procesarResultados = function (data) {
    mostrarResultados(data.data || []);
};

function mostrarResultados(canciones) {
    resultados.innerHTML = "";

    if (canciones.length === 0) {
        resultados.innerHTML = "<p class='text-center'>No se encontraron resultados</p>";
        return;
    }

    canciones.forEach(cancion => {
        const cancionElemento = caratulaAlbum.cloneNode(true);
        cancionElemento.style.display = "block";

        cancionElemento.querySelector(".portada").src = cancion.album.cover_medium;
        cancionElemento.querySelector(".titulo").textContent = cancion.title;
        cancionElemento.querySelector(".artista").textContent = cancion.artist.name;

        const audio = cancionElemento.querySelector("audio");
        audio.src = cancion.preview;
        audio.onerror = () => {
            audio.style.display = "none";
            const noPreview = document.createElement("p");
            noPreview.className = "text-muted small";
            noPreview.textContent = "Vista previa no disponible";
            audio.parentNode.insertBefore(noPreview, audio);
        };

        const btnAñadir = cancionElemento.querySelector("button");
        btnAñadir.addEventListener("click", () => {
            añadirAPlaylist(cancion);
        });

        resultados.appendChild(cancionElemento);
    });
}

function formatearDuracion(segundos) {
    const minutos = Math.floor(segundos / 60);
    const segundosRestantes = segundos % 60;
    return `${minutos}:${segundosRestantes < 10 ? '0' : ''}${segundosRestantes}`;
}

function añadirAPlaylist(cancion) {
    if (document.querySelector(`#playlist [data-song-id="${cancion.id}"]`)) {
        alert("Esta canción ya está en tu playlist");
        return;
    }

    const playlistItem = document.createElement("div");
    playlistItem.className = "playlist-item";
    playlistItem.dataset.songId = cancion.id;
    
    playlistItem.innerHTML = `
    <div class="playlist-item-inner">
        <img src="${cancion.album.cover_small}" alt="${cancion.title}">
        <div class="info">
            <h6>${cancion.title}</h6>
            <p>${cancion.artist.name}</p>
        </div>
        <audio class="audio-player" src="${cancion.preview}" preload="auto"></audio>
        <p class="duracion">${formatearDuracion(cancion.duration)}</p>

        <!-- Contenedor de los botones (Play, Pause, Eliminar) -->
        <div class="controls">
            <button class="btn btn-play">Play</button>
            <button class="btn btn-pause" style="display: none;">Pause</button>
            <button class="btn btn-danger btn-sm eliminar-btn"> <i class="fas fa-trash"></i></button>
        </div>
    </div>
`;
    playlist.appendChild(playlistItem);

    const btnEliminar = playlistItem.querySelector(".eliminar-btn");

    btnEliminar.addEventListener("click", () => {
        eliminarDePlaylist(cancion.id);
    });

    const btnPlay = playlistItem.querySelector(".btn-play");
    const btnPause = playlistItem.querySelector(".btn-pause");
    const audio = playlistItem.querySelector("audio");

    btnPlay.addEventListener("click", () => {
    reproducirCancion(audio, btnPlay, btnPause); 
	});
	btnPause.addEventListener("click", () => {
		pausarCancion(audio, btnPlay, btnPause);
	});
}

function eliminarDePlaylist(id) {
    const playlistItem = document.querySelector(`#playlist [data-song-id="${id}"]`);
    if (playlistItem) {
        playlistItem.remove();
    }
}

function reproducirCancion(audio, btnPlay, btnPause) {
    const todosLosAudio = document.querySelectorAll("audio");
    todosLosAudio.forEach(aud => {
        if (aud !== audio) {
            aud.pause(); // Pausa otros audios
        const btnPauseOtro = aud.parentElement.querySelector(".btn-pause");
            const btnPlayOtro = aud.parentElement.querySelector(".btn-play");
            if (btnPauseOtro) {
                btnPauseOtro.style.display = "none";
            }
            if (btnPlayOtro) {
                btnPlayOtro.style.display = "inline-block";
            }
        }
    });

    
    audio.currentTime = 0; 
    audio.play(); 

    // cambia btns
    btnPlay.style.display = "none";
    btnPause.style.display = "inline-block";

    // reinicia btns
    audio.addEventListener("ended", () => {
        btnPlay.style.display = "inline-block";
        btnPause.style.display = "none";
    });
}


function pausarCancion(audio, btnPlay, btnPause) {
    audio.pause();

    // Cambia btns
    btnPlay.style.display = "inline-block";
    btnPause.style.display = "none";
}

document.addEventListener("DOMContentLoaded", precargarPlaylist);

function precargarPlaylist() {
    const cancionesDeseadas = [
        "Bad Bunny",
        "Arctic Monkeys",
        "Coldplay",
        "Danny Ocean",
        "Maroon 5"
    ];

    cancionesDeseadas.forEach(query => buscarYAgregar(query));
}

function buscarYAgregar(query) {
    const url = `https://api.deezer.com/search?q=${encodeURIComponent(query)}&limit=1&output=jsonp&callback=procesarCancion`;

    const script = document.createElement("script");
    script.src = url;
    document.body.appendChild(script);
}

window.procesarCancion = function (data) {
    if (data && data.data && data.data.length > 0) {
        añadirAPlaylist(data.data[0]); //
    }
};