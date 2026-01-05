// elementos del dom
const botonAnadir = document.getElementById("addBtn");
const modal = document.getElementById("modal");
const formulario = document.getElementById("form");
const cuadricula = document.getElementById("grid");
const contador = document.getElementById("contador");
const detalles = document.getElementById("details");
const cerrarDetalles = document.getElementById("closeDetails");
const botonCancelar = document.getElementById("cancel");

// abrir modal
botonAnadir.addEventListener("click", () => {
  formulario.reset();
  limpiarErrores();
  modal.classList.remove("hidden");
});

// cerrar cosas
botonCancelar.addEventListener("click", () => modal.classList.add("hidden"));
cerrarDetalles.addEventListener("click", () => detalles.classList.add("hidden"));

/***********************************************************************************************************************/

// Cargar productos desde la base de datos al iniciar
async function cargarProductos() {
  try {
    // Mostrar estado de carga
    cuadricula.innerHTML = '<div class="empty">Cargando productos...</div>';
    
    const productos = await API.obtenerProductos();
    
    // Limpiar el grid
    cuadricula.innerHTML = "";
    
    if (productos.length === 0) {
      cuadricula.innerHTML = `
        <div class="empty">
          Todavía no hay productos.<br>Añade el primero pulsando el botón de arriba.
        </div>
      `;
    } else {
      // Crear tarjetas para cada producto
      productos.forEach(producto => {
        crearTarjeta(producto);
      });
    }
    
    actualizarContador();
    mostrarMensaje("Productos cargados correctamente", "success");
  } catch (error) {
    console.error("Error al cargar productos:", error);
    cuadricula.innerHTML = `
      <div class="empty">
        Error al cargar productos: ${error.message}<br>
        Por favor, recarga la página.
      </div>
    `;
    mostrarMensaje("Error al cargar productos: " + error.message, "error");
  }
}

// Cargar productos cuando la página esté lista
document.addEventListener("DOMContentLoaded", () => {
  cargarProductos();
});

/***********************************************************************************************************************/

// validar que la imagen existe antes de guardar
function validarImagen(url) {
  return new Promise((resolver, rechazar) => {
    const img = new Image();
    
    img.onload = () => resolver();
    img.onerror = () => rechazar("La URL de la imagen no es válida");
    
    // por si tarda mucho
    setTimeout(() => rechazar("La imagen tarda demasiado en cargar"), 10000);
    
    img.src = url;
  });
}

/***********************************************************************************************************************/

// cuando se envia el formulario
formulario.addEventListener("submit", async function(e) {
  e.preventDefault();
  console.log("Enviando formulario...");
  
  // cogemos los datos
  const id = document.getElementById("id").value.trim();
  const nombre = document.getElementById("name").value.trim();
  const precio = document.getElementById("price").value;
  const descripcion = document.getElementById("desc").value.trim();
  const imagen = document.getElementById("image").value.trim();
  
  limpiarErrores();
  let hayErrores = false;
  
  // validaciones basicas (síncronas - frontend)
  if (!id) {
    mostrarError("id", "El ID es obligatorio");
    hayErrores = true;
  } else if (id.length > 50) {
    mostrarError("id", "El ID no puede tener más de 50 caracteres");
    hayErrores = true;
  }
  
  if (!nombre) {
    mostrarError("name", "El nombre es obligatorio");
    hayErrores = true;
  } else if (nombre.length > 100) {
    mostrarError("name", "El nombre no puede tener más de 100 caracteres");
    hayErrores = true;
  }
  
  if (!precio || isNaN(precio) || parseFloat(precio) <= 0) {
    mostrarError("price", "Pon un precio válido");
    hayErrores = true;
  }
  
  if (!descripcion) {
    mostrarError("desc", "La descripción es obligatoria");
    hayErrores = true;
  }
  
  if (!imagen) {
    mostrarError("image", "Pon una URL de imagen");
    hayErrores = true;
  } else if (imagen.length > 255) {
    mostrarError("image", "La URL no puede tener más de 255 caracteres");
    hayErrores = true;
  }
  
  if (hayErrores) return;
  
  const boton = formulario.querySelector('button[type="submit"]');
  boton.disabled = true;
  boton.textContent = "Validando imagen...";
  
  // primero comprobamos que la imagen carga bien
  try {
    await validarImagen(imagen);
  } catch (err) {
    mostrarError("image", err);
    boton.disabled = false;
    boton.textContent = "Guardar";
    return;
  }
  
  // ahora guardamos en la base de datos (operación asíncrona)
  boton.textContent = "Guardando...";
  
  const producto = { id, nombre, precio: parseFloat(precio), desc: descripcion, imagen };
  
  try {
    // Esperar respuesta del servidor (asíncrono)
    const productoGuardado = await API.guardarProducto(producto);
    
    // Todo bien, creamos la tarjeta con los datos del servidor
    console.log("Producto guardado correctamente");
    crearTarjeta(productoGuardado);
    actualizarContador();
    formulario.reset();
    modal.classList.add("hidden");
    mostrarMensaje("Producto guardado correctamente", "success");
  } catch (error) {
    // Error del servidor (ID duplicado, error de conexión, etc.)
    console.error("Error al guardar:", error);
    const mensajeError = error.message || "Error al guardar el producto";
    mostrarError("id", mensajeError);
    mostrarMensaje(mensajeError, "error");
  } finally {
    // Siempre restaurar el botón, incluso si hay error
    boton.disabled = false;
    boton.textContent = "Guardar";
  }
});

/***********************************************************************************************************************/

function mostrarError(campo, mensaje) {
  const input = document.getElementById(campo);
  const span = document.getElementById("err-" + campo);
  input.classList.add("input-error");
  if (span) span.textContent = mensaje;
}

/***********************************************************************************************************************/

function limpiarErrores() {
  document.querySelectorAll(".error").forEach(e => e.textContent = "");
  document.querySelectorAll("input, textarea").forEach(elemento => {
    elemento.classList.remove("input-error");
  });
}

/***********************************************************************************************************************/

// crear la tarjeta del producto en el grid
function crearTarjeta(producto) {
  // quitamos el mensaje de "no hay productos" si existe
  const vacio = document.querySelector(".empty");
  if (vacio) vacio.remove();
  
  const tarjeta = document.createElement("div");
  tarjeta.className = "card";
  tarjeta.dataset.id = producto.id;
  tarjeta.innerHTML = `
    <img src="${producto.imagen}" alt="${producto.nombre}">
    <h3>${producto.nombre}</h3>
  `;
  
  // click para ver detalles
  tarjeta.onclick = () => mostrarDetalles(producto);
  
  // click derecho para eliminar
  tarjeta.oncontextmenu = async (e) => {
    e.preventDefault();
    if (confirm(`¿Seguro que quieres eliminar "${producto.nombre}"?`)) {
      await borrarProducto(producto.id, tarjeta);
    }
  };
  
  cuadricula.appendChild(tarjeta);
}

/***********************************************************************************************************************/

// borrar producto (asíncrono con async/await)
async function borrarProducto(id, tarjeta) {
  // Ponemos la tarjeta medio transparente mientras se borra (feedback visual)
  tarjeta.classList.add("loading");
  
  try {
    // Esperar respuesta del servidor (operación asíncrona)
    await API.borrarProducto(id);
    console.log("Producto eliminado");
    
    // Eliminar tarjeta del DOM
    tarjeta.remove();
    actualizarContador();
    mostrarMensaje("Producto eliminado correctamente", "success");
    
    // Si no quedan productos mostramos el mensaje
    if (API.contarProductos() === 0) {
      cuadricula.innerHTML = `
        <div class="empty">
          Todavía no hay productos.<br>Añade el primero pulsando el botón de arriba.
        </div>
      `;
    }
  } catch (error) {
    // Error del servidor (producto no encontrado, error de conexión, etc.)
    console.error("Error al borrar:", error);
    tarjeta.classList.remove("loading");
    const mensajeError = error.message || "Error al eliminar el producto";
    mostrarMensaje(mensajeError, "error");
  }
}

/***********************************************************************************************************************/

function mostrarDetalles(producto) {
  document.getElementById("detailImg").src = producto.imagen;
  document.getElementById("detailName").textContent = producto.nombre;
  document.getElementById("detailId").textContent = "ID: " + producto.id;
  document.getElementById("detailPrice").textContent = producto.precio + " €";
  document.getElementById("detailDesc").textContent = producto.desc || "";
  detalles.classList.remove("hidden");
}

/***********************************************************************************************************************/

function actualizarContador() {
  const total = API.contarProductos();
  contador.textContent = total + (total === 1 ? " producto" : " productos");
}

/***********************************************************************************************************************/

// Mostrar mensaje de feedback (éxito o error)
function mostrarMensaje(mensaje, tipo = "success") {
  // Eliminar mensaje anterior si existe
  const mensajeAnterior = document.querySelector(".mensaje");
  if (mensajeAnterior) {
    mensajeAnterior.remove();
  }
  
  // Crear nuevo mensaje
  const divMensaje = document.createElement("div");
  divMensaje.className = `mensaje ${tipo}`;
  divMensaje.textContent = mensaje;
  
  document.body.appendChild(divMensaje);
  
  // Eliminar después de 3 segundos
  setTimeout(() => {
    divMensaje.style.animation = "slideOut 0.3s ease";
    setTimeout(() => divMensaje.remove(), 300);
  }, 3000);
}
