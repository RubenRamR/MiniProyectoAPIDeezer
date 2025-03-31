const btnBuscar = document.getElementById("btnBuscar");
const campoBusqueda = document.getElementById("campoBusqueda");
const resultados = document.getElementById("resultados");
const caratulaAlbum = document.getElementById("caratulaAlbum");

btnBuscar.addEventListener("click", buscarCanciones);
campoBusqueda.addEventListener("keypress", (e) => {
    if (e.key === "Enter") buscarCanciones();
});

function buscarCanciones() {
    const query = campoBusqueda.value.trim();
    if (!query) return alert("¡Escribe algo!");

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
        resultados.innerHTML;
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
            cancionElemento.querySelector(".card-body").innerHTML;
        };

        resultados.appendChild(cancionElemento);
    });
};