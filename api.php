<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

// Manejar preflight requests
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
  http_response_code(200);
  exit;
}

$host = "fdb1032.awardspace.net";
$db   = "4717047_catalogo";
$user = "4717047_catalogo";
$pass = "8qM%2bcI7Xsq?*K9";

try {
  $pdo = new PDO(
    "mysql:host=$host;dbname=$db;charset=utf8",
    $user,
    $pass,
    [PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION]
  );
} catch (Exception $e) {
  echo json_encode(["success" => false, "error" => "Error de conexión a la base de datos"]);
  exit;
}

// Obtener el método HTTP
$method = $_SERVER['REQUEST_METHOD'];

try {
  switch ($method) {
    case 'GET':
      // Listar todos los productos
      $stmt = $pdo->query("SELECT id, nombre, precio, descripcion as `desc`, imagen FROM productos ORDER BY id");
      $productos = $stmt->fetchAll(PDO::FETCH_ASSOC);
      echo json_encode(["success" => true, "data" => $productos]);
      break;

    case 'POST':
      // Crear un nuevo producto
      $data = json_decode(file_get_contents('php://input'), true);
      
      if (!isset($data['id']) || !isset($data['nombre']) || !isset($data['precio']) || 
          !isset($data['desc']) || !isset($data['imagen'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "Faltan campos obligatorios"]);
        exit;
      }

      $id = trim($data['id']);
      $nombre = trim($data['nombre']);
      $precio = floatval($data['precio']);
      $descripcion = trim($data['desc']);
      $imagen = trim($data['imagen']);

      // Validar que el precio sea positivo
      if ($precio <= 0) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "El precio debe ser mayor que 0"]);
        exit;
      }

      // Validar longitud de campos según la estructura de la tabla
      if (strlen($id) > 50) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "El ID no puede tener más de 50 caracteres"]);
        exit;
      }
      
      if (strlen($nombre) > 100) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "El nombre no puede tener más de 100 caracteres"]);
        exit;
      }
      
      if (strlen($imagen) > 255) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "La URL de la imagen no puede tener más de 255 caracteres"]);
        exit;
      }

      // Intentar insertar
      $stmt = $pdo->prepare("INSERT INTO productos (id, nombre, precio, descripcion, imagen) VALUES (?, ?, ?, ?, ?)");
      $stmt->execute([$id, $nombre, $precio, $descripcion, $imagen]);
      
      echo json_encode([
        "success" => true, 
        "message" => "Producto guardado correctamente",
        "data" => [
          "id" => $id,
          "nombre" => $nombre,
          "precio" => $precio,
          "desc" => $descripcion,
          "imagen" => $imagen
        ]
      ]);
      break;

    case 'DELETE':
      // Eliminar un producto
      $data = json_decode(file_get_contents('php://input'), true);
      
      if (!isset($data['id'])) {
        http_response_code(400);
        echo json_encode(["success" => false, "error" => "ID no proporcionado"]);
        exit;
      }

      $id = trim($data['id']);
      $stmt = $pdo->prepare("DELETE FROM productos WHERE id = ?");
      $stmt->execute([$id]);

      if ($stmt->rowCount() === 0) {
        http_response_code(404);
        echo json_encode(["success" => false, "error" => "Producto no encontrado"]);
      } else {
        echo json_encode(["success" => true, "message" => "Producto eliminado correctamente"]);
      }
      break;

    default:
      http_response_code(405);
      echo json_encode(["success" => false, "error" => "Método no permitido"]);
      break;
  }
} catch (PDOException $e) {
  // Manejar errores de base de datos
  $errorCode = $e->getCode();
  $errorMessage = $e->getMessage();
  
  // Código 23000 = Violación de restricción única (ID duplicado)
  // Código 42S02 = Tabla no existe
  if ($errorCode == 23000 || strpos($errorMessage, 'Duplicate entry') !== false) {
    http_response_code(409);
    echo json_encode(["success" => false, "error" => "El ID ya existe en la base de datos"]);
  } elseif ($errorCode == '42S02' || strpos($errorMessage, "doesn't exist") !== false) {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "La tabla de productos no existe. Ejecuta el script crear_tabla.sql primero."]);
  } else {
    http_response_code(500);
    echo json_encode(["success" => false, "error" => "Error en la base de datos: " . $errorMessage]);
  }
} catch (Exception $e) {
  http_response_code(500);
  echo json_encode(["success" => false, "error" => "Error del servidor: " . $e->getMessage()]);
}
