# Catálogo de Productos - Frontend + Backend Separados

## Estructura

```
Frontend (saidoudrhich.atwebpages.com)
├── index.html
├── styles.css
├── script.js
└── api.js

Backend (catalogoapi.atwebpages.com)
├── api.php
└── crear_tabla.sql
```

## Configuración

### 1. Backend (catalogoapi.atwebpages.com)

1. Sube `api.php` al hosting
2. Crea la base de datos MySQL
3. Ejecuta `crear_tabla.sql` en phpMyAdmin
4. Edita `api.php` con tus credenciales:

```php
$host = "tu_host";
$db   = "tu_base_de_datos";
$user = "tu_usuario";
$pass = "tu_contraseña";
```

### 2. Frontend (saidoudrhich.atwebpages.com)

1. Sube `index.html`, `styles.css`, `script.js` y `api.js`
2. Verifica que `api.js` apunte al backend:

```javascript
_baseURL: "http://catalogoapi.atwebpages.com/api.php"
```

## API Endpoints

| Método | Acción | Respuesta |
|--------|--------|-----------|
| GET | Listar productos | `{ success: true, data: [...] }` |
| POST | Crear producto | `{ success: true, data: {...} }` |
| DELETE | Eliminar producto | `{ success: true, message: "..." }` |

## Tecnologías

- Frontend: HTML, CSS, JavaScript (fetch + async/await)
- Backend: PHP + MySQL (PDO)
- Hosting: AwardSpace
