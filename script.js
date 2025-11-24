// Se añade un "listener" al formulario para interceptar el evento submit
form.addEventListener("submit", function (e) {
  // Evita que el formulario se envíe y recargue la página
  e.preventDefault();

  // Obtiene los valores de los campos del formulario y elimina espacios innecesarios
  const id = document.getElementById("id").value.trim();
  const nombre = document.getElementById("name").value.trim();
  const precio = document.getElementById("price").value;
  const file = document.getElementById("image").files[0]; // archivo de imagen

  // Limpia mensajes de error anteriores
  limpiarErrores();

  // Variable de control para validar el formulario
  let ok = true;

  // Validación del ID
  if (!id) {
    // Si el campo está vacío, muestra un error
    document.getElementById("err-id").textContent = "El ID es obligatorio";
    ok = false;
  } else if (productos.some((p) => p.id === id)) {
    // Si el ID ya existe en la lista de productos, muestra otro error
    document.getElementById("err-id").textContent = "Ese ID ya existe";
    ok = false;
  }

  // Si hay errores o no hay imagen, se detiene aquí
  if (!ok || !file) return;

  // Crea una URL temporal para mostrar la imagen seleccionada en la página
  const imagenUrl = URL.createObjectURL(file);

  // Crea un objeto producto con los datos del formulario
  const producto = { id, nombre, precio, imagen: imagenUrl };
  productos.push(producto);

  // Muestra el producto en la interfaz
  mostrarProducto(producto);

  // Oculta el modal del formulario
  modal.classList.add("hidden");
});

// Función que limpia todos los mensajes de error visibles
function limpiarErrores() {
  document.querySelectorAll(".error").forEach((e) => (e.textContent = ""));
}
