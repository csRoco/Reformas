# Catálogo de Productos v3

Práctica de 2º DAW - Frontend y Backend separados con PHP y MySQL.

## Estructura

**Frontend** (saidoudrhich.atwebpages.com)
- `index.html` - Página principal
- `styles.css` - Estilos
- `script.js` - Lógica del catálogo
- `api.js` - Conexión con el backend

**Backend** (catalogoapi.atwebpages.com)
- `api.php` - API REST
- `crear_tabla.sql` - Script para crear la tabla

## Configuración

1. Crear la base de datos y ejecutar `crear_tabla.sql`
2. Editar credenciales en `api.php`
3. Subir `api.php` al servidor del backend
4. Subir el resto de archivos al servidor del frontend

## API

| Método | Acción | Respuesta |
|--------|--------|-----------|
| GET | Listar productos | `{ success: true, data: [...] }` |
| POST | Crear producto | `{ success: true, data: {...} }` |
| DELETE | Eliminar producto | `{ success: true, message: "..." }` |
