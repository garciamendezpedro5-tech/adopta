<?php
header('Content-Type: application/json; charset=utf-8');
require_once __DIR__ . '/conexion.php';

$consulta = $conexion->query(
    'SELECT id, nombre, especie, raza, edad, foto FROM mascotas'
);

echo json_encode($consulta->fetchAll(PDO::FETCH_ASSOC), JSON_UNESCAPED_UNICODE);
