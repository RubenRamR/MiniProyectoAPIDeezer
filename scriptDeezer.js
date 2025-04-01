const btnBuscar = document.getElementById("btnBuscar");
const campoBusqueda = document.getElementById("campoBusqueda");
const resultados = document.getElementById("resultados");
const caratulaAlbum = document.getElementById("caratulaAlbum");
const playlist = document.getElementById("playlist");

btnBuscar.addEventListener("click", buscarCanciones);
campoBusqueda.addEventListener("keypress", (e) => {
    if (e.key === "Enter") buscarCanciones();
});

function buscarCanciones() {
    const query = campoBusqueda.value.trim();
    if (!query) return alert("¡Escribe algo!");

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

function añadirAPlaylist(cancion) {
    if (document.querySelector(`#playlist [data-song-id="${cancion.id}"]`)) {
        alert("Esta canción ya está en tu playlist");
        return;
    }

    const playlistItem = document.createElement("div");
    playlistItem.className = "playlist-item";
    playlistItem.dataset.songId = cancion.id;
    
    playlistItem.innerHTML = `
        <img src="${cancion.album.cover_small}" alt="${cancion.title}">
        <div class="info">
            <h6>${cancion.title}</h6>
            <p>${cancion.artist.name}</p>
        </div>
        <button class="btn btn-danger btn-sm">Eliminar</button>
        
    `;

    playlistItem.querySelector("button").addEventListener("click", function() {
        playlistItem.remove();
    });

    playlist.appendChild(playlistItem);
}

function eliminarDePlaylist(id) {
    const playlistItem = document.querySelector(`#playlist [data-song-id="${id}"]`);
    if (playlistItem) {
        playlistItem.remove();
    }
}