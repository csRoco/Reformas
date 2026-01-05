// api.js - API real con fetch hacia PHP/MySQL
console.log("API cargada - Conectando con backend PHP");

const API = {
  // URL del backend PHP
  _baseURL: "http://catalogoapi.atwebpages.com/api.php",

  // Cache local de productos para contar rápidamente
  _productos: [],

  // Obtener todos los productos desde la base de datos
  async obtenerProductos() {
    try {
      const respuesta = await fetch(this._baseURL, {
        method: "GET",
        headers: {
          "Content-Type": "application/json"
        }
      });

      const resultado = await respuesta.json();

      if (!resultado.success) {
        throw new Error(resultado.error || "Error al obtener productos");
      }

      // Actualizar cache local
      this._productos = resultado.data || [];
      return this._productos;
    } catch (error) {
      console.error("Error al obtener productos:", error);
      throw error;
    }
  },

  // Guardar producto nuevo en la base de datos
  async guardarProducto(producto) {
    try {
      const respuesta = await fetch(this._baseURL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
      });

      const resultado = await respuesta.json();

      if (!resultado.success) {
        // Extraer mensaje de error del servidor
        const mensajeError = resultado.error || "Error al guardar el producto";
        throw new Error(mensajeError);
      }

      // Actualizar cache local con el nuevo producto
      this._productos.push(resultado.data);
      
      return resultado.data;
    } catch (error) {
      console.error("Error al guardar producto:", error);
      throw error;
    }
  },

  // Borrar un producto por su ID
  async borrarProducto(id) {
    try {
      const respuesta = await fetch(this._baseURL, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ id: id })
      });

      const resultado = await respuesta.json();

      if (!resultado.success) {
        const mensajeError = resultado.error || "Error al eliminar el producto";
        throw new Error(mensajeError);
      }

      // Actualizar cache local
      this._productos = this._productos.filter(p => p.id !== id);
      
      return resultado.message;
    } catch (error) {
      console.error("Error al borrar producto:", error);
      throw error;
    }
  },

  // Contar productos (usa cache local)
  contarProductos() {
    return this._productos.length;
  }
};
