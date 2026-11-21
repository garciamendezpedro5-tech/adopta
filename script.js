let mascotas = [
  { nombre: "Luna", especie: "Perro", raza: "Schnauzer", edad: "Joven", foto: "fotos/img_perrito1.jpg" },
  { nombre: "Milo", especie: "Gato", raza: "Gato doméstico", edad: "Cachorro", foto: "fotos/IMG_20261119_155458_043.jpg" },
  { nombre: "Nala", especie: "Perro", raza: "Criollo Mestizo", edad: "Adulto", foto: "fotos/img_perrito2.jpg" },
  { nombre: "Simón", especie: "Gato", raza: "Atigrado", edad: "Joven", foto: "photo-1573865526739-10659fec78a5" },
  { nombre: "Coco", especie: "Perro", raza: "Beagle mestizo", edad: "Cachorro", foto: "photo-1505628346881-b72b27e84530" },
  { nombre: "Mora", especie: "Gato", raza: "Gata doméstica", edad: "Adulto", foto: "photo-1495360010541-f48722b34f7d" }
];

const $ = (id) => document.getElementById(id);
const favoritos = new Set();
let mascotaElegida;

// Catálogo
function mostrarMascotas() {
  const texto = $("searchInput").value.toLowerCase();
  const especie = $("speciesFilter").value;
  const edad = $("ageFilter").value;
  const resultados = mascotas.filter((m) =>
    (m.nombre.toLowerCase().includes(texto) || m.raza.toLowerCase().includes(texto)) &&
    (!especie || m.especie === especie) && (!edad || m.edad === edad));

  $("resultCount").textContent = `Mostrando ${resultados.length} de ${mascotas.length} patitas`;
  $("petGrid").innerHTML = resultados.length ? resultados.map((m) => {
    const id = mascotas.indexOf(m), favorita = favoritos.has(id);
    const foto = m.foto.startsWith("photo-")
      ? `https://images.unsplash.com/${m.foto}?auto=format&fit=crop&w=600&q=80`
      : m.foto;
    return `<article class="pet-card"><div class="pet-image">
      <img src="${foto}" alt="${m.nombre}" loading="lazy">
      <button class="favorite ${favorita ? "active" : ""}" type="button" data-favorito="${id}" aria-label="Cambiar favorito">${favorita ? "♥" : "♡"}</button>
    </div><div class="pet-info"><h3>${m.nombre}</h3><div class="breed">${m.raza}</div>
      <div class="pet-meta">${m.especie} · ${m.edad}</div>
      <button class="adopt-btn" type="button" data-adoptar="${id}">Conocer a ${m.nombre}</button>
    </div></article>`;
  }).join("") : "<p>No encontramos mascotas con esos filtros.</p>";
}

function abrirModal(id) { $(id).classList.add("open"); }
function cerrarModales() {
  document.querySelectorAll(".modal-backdrop.open").forEach((modal) => modal.classList.remove("open"));
}

// Sesión
function usuarioActual() { return JSON.parse(sessionStorage.getItem("usuario") || "null"); }
function actualizarSesion() {
  const usuario = usuarioActual();
  $("loginButton").textContent = usuario ? `Hola, ${usuario.nombre} · Salir` : "Iniciar sesión";
}

$("loginButton").addEventListener("click", () => {
  if (usuarioActual()) {
    sessionStorage.removeItem("usuario");
    actualizarSesion();
  } else abrirModal("loginModal");
});

$("loginForm").addEventListener("submit", (evento) => {
  evento.preventDefault();
  sessionStorage.setItem("usuario", JSON.stringify({ nombre: $("userName").value }));
  actualizarSesion();
  cerrarModales();
  evento.target.reset();
});

// Interacciones
document.addEventListener("click", (evento) => {
  const favorito = evento.target.closest("[data-favorito]");
  if (favorito) {
    const id = Number(favorito.dataset.favorito);
    favoritos.has(id) ? favoritos.delete(id) : favoritos.add(id);
    mostrarMascotas();
  }

  const adoptar = evento.target.closest("[data-adoptar]");
  if (adoptar) {
    if (!usuarioActual()) return abrirModal("loginModal");
    mascotaElegida = mascotas[Number(adoptar.dataset.adoptar)];
    $("adoptionTitle").textContent = `Solicitud para ${mascotaElegida.nombre}`;
    abrirModal("adoptionModal");
  }
  if (evento.target.closest("[data-close]")) cerrarModales();
});

document.querySelectorAll(".modal-backdrop").forEach((fondo) =>
  fondo.addEventListener("click", (evento) => {
    if (evento.target === fondo) cerrarModales();
  }));

document.addEventListener("keydown", (evento) => {
  if (evento.key === "Escape") cerrarModales();
});

// Solicitud
$("adoptionForm").addEventListener("submit", (evento) => {
  evento.preventDefault();
  cerrarModales();
  evento.target.reset();
  $("toast").textContent = `Solicitud enviada para ${mascotaElegida.nombre}`;
  $("toast").classList.add("show");
  setTimeout(() => $("toast").classList.remove("show"), 3000);
});

$("clearFilters").addEventListener("click", () => {
  $("searchInput").value = $("speciesFilter").value = $("ageFilter").value = "";
  mostrarMascotas();
});

["searchInput", "speciesFilter", "ageFilter"].forEach((id) =>
  $(id).addEventListener(id === "searchInput" ? "input" : "change", mostrarMascotas));

// Inicialización
actualizarSesion();
fetch("api/mascotas.php")
  .then((respuesta) => {
    if (!respuesta.ok) throw new Error("Error al cargar las mascotas");
    return respuesta.json();
  })
  .then((datos) => {
    mascotas = datos;
    mostrarMascotas();
  })
  .catch((error) => {
    console.error(error);
    document.getElementById("petGrid").textContent =
      "No se pudieron cargar las mascotas.";
  });
