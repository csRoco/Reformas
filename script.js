// Array para guardar los productos
let productos = [];
console.log("Productos inicial:", productos);

// Referencias a elementos del DOM
const addBtn = document.getElementById("addBtn");
const modal = document.getElementById("modal");
const form = document.getElementById("form");
const grid = document.getElementById("grid");
const contador = document.getElementById("contador");
const details = document.getElementById("details");
const closeDetails = document.getElementById("closeDetails");
const cancelBtn = document.getElementById("cancel");

console.log("Elementos del DOM cargados:", {
  addBtn,
  modal,
  form,
  grid,
  contador,
  details,
});

// Abrir el modal para añadir un producto
addBtn.addEventListener("click", () => {
  console.log("Botón 'Añadir' clickeado");
  form.reset();
  limpiarErrores();
  modal.classList.remove("hidden");
});

// Cerrar el modal o detalles
cancelBtn.addEventListener("click", () => {
  console.log("Modal cerrado");
  modal.classList.add("hidden");
});
closeDetails.addEventListener("click", () => {
  console.log("Detalles cerrados");
  details.classList.add("hidden");
});

// Manejar el submit del formulario
form.addEventListener("submit", function (e) {
  e.preventDefault();
  console.log("Formulario enviado");

  // Obtener valores del formulario
  const id = document.getElementById("id").value.trim();
  const nombre = document.getElementById("name").value.trim();
  const precio = document.getElementById("price").value;
  const desc = document.getElementById("desc").value.trim();
  const file = document.getElementById("image").files[0];

  console.log("Datos del formulario:", { id, nombre, precio, desc, file });

  limpiarErrores();
  let ok = true;

  // Validaciones
  if (!id) {
    document.getElementById("err-id").textContent = "El ID es obligatorio";
    ok = false;
    console.log("Error: ID vacío");
  } else if (productos.some((p) => p.id === id)) {
    document.getElementById("err-id").textContent = "Ese ID ya existe";
    ok = false;
    console.log("Error: ID duplicado");
  }

  if (!nombre) {
    ok = false;
    console.log("Error: Nombre vacío");
  }
  if (!precio) {
    ok = false;
    console.log("Error: Precio vacío");
  }
  if (!desc) {
    ok = false;
    console.log("Error: Descripción vacía");
  }
  if (!file) {
    ok = false;
    console.log("Error: Imagen no seleccionada");
  }

  if (!ok) return;

  // Crear URL temporal de la imagen
  const imagenUrl = URL.createObjectURL(file);
  console.log("URL temporal de la imagen creada:", imagenUrl);

  // Crear objeto producto
  const producto = { id, nombre, precio, desc, imagen: imagenUrl };
  productos.push(producto);
  console.log("Producto añadido:", producto);
  console.log("Array de productos ahora:", productos);

  añadirTarjeta(producto);
  actualizarContador();
  modal.classList.add("hidden");
  console.log("Modal cerrado tras añadir producto");
});

// Función para limpiar errores
function limpiarErrores() {
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
  console.log("Errores limpiados");
}

// Crear tarjeta del producto
function añadirTarjeta(p) {
  document.querySelector(".empty")?.remove();
  console.log("Añadiendo tarjeta para producto:", p);

  const div = document.createElement("div");
  div.className = "card";
  div.innerHTML = `
    <img src="${p.imagen}" alt="${p.nombre}">
    <h3>${p.nombre}</h3>
  `;
  div.onclick = () => mostrarDetalles(p);
  grid.appendChild(div);
  console.log("Tarjeta añadida al grid");
}

// Mostrar detalles de un producto
function mostrarDetalles(p) {
  console.log("Mostrando detalles de producto:", p);
  document.getElementById("detailImg").src = p.imagen;
  document.getElementById("detailName").textContent = p.nombre;
  document.getElementById("detailId").textContent = "ID: " + p.id;
  document.getElementById("detailPrice").textContent = p.precio + " €";
  document.getElementById("detailDesc").textContent = p.desc;
  details.classList.remove("hidden");
}

// Actualizar contador de productos
function actualizarContador() {
  contador.textContent =
    productos.length + (productos.length === 1 ? " producto" : " productos");
  console.log("Contador actualizado:", contador.textContent);
}
