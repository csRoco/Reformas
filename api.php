<?php
// API del Catálogo de Productos
// Operaciones CRUD con MySQL

header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

// conexion a la base de datos
try {
    $pdo = new PDO(
        "mysql:host=fdb1032.awardspace.net;dbname=4717047_catalogo;charset=utf8",
        "4717047_catalogo",
        "8qM%2bcI7Xsq?*K9"
    );
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (Exception $e) {
    responder(false, "Error de conexión");
}

// procesar segun el metodo HTTP
try {
    switch ($_SERVER['REQUEST_METHOD']) {
        case 'GET':
            listarProductos();
            break;
        case 'POST':
            crearProducto();
            break;
        case 'DELETE':
            eliminarProducto();
            break;
        default:
            http_response_code(405);
            responder(false, "Método no permitido");
    }
} catch (PDOException $e) {
    if (strpos($e->getMessage(), 'Duplicate') !== false) {
        http_response_code(409);
        responder(false, "El ID ya existe");
    }
    http_response_code(500);
    responder(false, "Error en la base de datos");
}


// ========== FUNCIONES ==========

function listarProductos() {
    global $pdo;
    $sql = "SELECT id, nombre, precio, descripcion as `desc`, imagen FROM productos ORDER BY id";
    $stmt = $pdo->query($sql);
    responder(true, null, $stmt->fetchAll(PDO::FETCH_ASSOC));
}

function crearProducto() {
    global $pdo;
    $data = json_decode(file_get_contents('php://input'), true);
    
    // comprobar que vienen todos los campos
    foreach (['id', 'nombre', 'precio', 'desc', 'imagen'] as $campo) {
        if (empty($data[$campo])) {
            http_response_code(400);
            responder(false, "Falta el campo: $campo");
        }
    }
    
    $id = trim($data['id']);
    $nombre = trim($data['nombre']);
    $precio = floatval($data['precio']);
    $desc = trim($data['desc']);
    $imagen = trim($data['imagen']);
    
    // validar precio
    if ($precio <= 0) {
        http_response_code(400);
        responder(false, "El precio debe ser mayor que 0");
    }
    
    // insertar en la bd
    $sql = "INSERT INTO productos (id, nombre, precio, descripcion, imagen) VALUES (?, ?, ?, ?, ?)";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([$id, $nombre, $precio, $desc, $imagen]);
    
    responder(true, "Producto guardado", [
        "id" => $id,
        "nombre" => $nombre,
        "precio" => $precio,
        "desc" => $desc,
        "imagen" => $imagen
    ]);
}

function eliminarProducto() {
    global $pdo;
    $data = json_decode(file_get_contents('php://input'), true);
    
    if (empty($data['id'])) {
        http_response_code(400);
        responder(false, "ID no proporcionado");
    }
    
    $sql = "DELETE FROM productos WHERE id = ?";
    $stmt = $pdo->prepare($sql);
    $stmt->execute([trim($data['id'])]);
    
    if ($stmt->rowCount() === 0) {
        http_response_code(404);
        responder(false, "Producto no encontrado");
    }
    
    responder(true, "Producto eliminado");
}

function responder($ok, $mensaje = null, $datos = null) {
    $resp = ["success" => $ok];
    if ($datos !== null) $resp["data"] = $datos;
    if ($mensaje && $ok) $resp["message"] = $mensaje;
    if ($mensaje && !$ok) $resp["error"] = $mensaje;
    echo json_encode($resp);
    exit;
}
