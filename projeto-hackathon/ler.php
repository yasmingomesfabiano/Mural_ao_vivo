<?php
require "conexao.php";

$stmt = $pdo->query("
    SELECT * FROM (
        SELECT texto, DATE_FORMAT(data_envio, '%H:%i') as hora, id 
        FROM mensagens 
        ORDER BY id DESC 
        LIMIT 15
    ) AS subconsulta 
    ORDER BY id ASC
");
$mensagens = $stmt->fetchAll(PDO::FETCH_ASSOC);

header('Content-Type: application/json');
echo json_encode($mensagens);