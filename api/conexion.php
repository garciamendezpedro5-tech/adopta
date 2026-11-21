<?php
$conexion = new PDO(
    'mysql:host=localhost;port=33065;dbname=adopta_db;charset=utf8mb4',
    'root',
    ''
);

$conexion->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
