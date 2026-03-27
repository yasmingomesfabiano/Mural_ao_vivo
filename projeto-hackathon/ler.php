<?php
require "conexao.php";

$stmt = $pdo->query("
    SELECT  
            m.texto, 
            DATE_FORMAT(m.data_envio, '%H:%i') as hora, 
            m.id, 
            u.nome, 
            m.usuario_id 
        FROM mensagens m
        LEFT JOIN usuarios u ON m.usuario_id = u.id
        ORDER BY m.id DESC 
        LIMIT 15
");
$mensagens = $stmt->fetchAll(PDO::FETCH_ASSOC);
$mensagensInvertidas = array_reverse($mensagens);

header('Content-Type: application/json');
echo json_encode($mensagensInvertidas);