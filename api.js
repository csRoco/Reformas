// api.js - simula las llamadas al servidor
console.log("API cargada");

const API = {
  // aqui guardamos los productos (como si fuera la base de datos)
  _productos: [],

  // guardar producto nuevo
  guardarProducto(producto) {
    return new Promise((resolver, rechazar) => {
      // simulamos que tarda 2 seg como si fuera una peticion real
      setTimeout(() => {
        // miramos si ya existe ese id
        const yaExiste = this._productos.find(p => p.id === producto.id);
        
        if (yaExiste) {
          rechazar("Error: El ID ya existe");
        } else {
          this._productos.push(producto);
          resolver("Producto guardado");
        }
      }, 2000);
    });
  },

  // borrar un producto por su id
  borrarProducto(id) {
    return new Promise((resolver, rechazar) => {
      setTimeout(() => {
        // a veces el servidor falla (10% de las veces)
        if (Math.random() < 0.1) {
          rechazar("Error del servidor: No se pudo eliminar el producto");
          return;
        }
        
        const indice = this._productos.findIndex(p => p.id === id);
        if (indice === -1) {
          rechazar("Error: Producto no encontrado");
        } else {
          this._productos.splice(indice, 1);
          resolver("Producto eliminado");
        }
      }, 1500);
    });
  },

  // para saber cuantos hay
  contarProductos() {
    return this._productos.length;
  }
};
