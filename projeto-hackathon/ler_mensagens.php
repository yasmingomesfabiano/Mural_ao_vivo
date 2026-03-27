<?php
session_start();
require_once 'conexao.php';

$meu_id=$_SESSION['id_usuario'];
$outro_id = $_GET['destinatario']; //o id do destinatario vem via URL

$sql = "SELECT * FROM chat_privado 
WHERE(remetente = :meu_id AND destinatario = :outro_id) 
OR (remetente = :outro_id AND destinatario = :meu_id)
ORDER BY data_envio ASC";

$stmt = $pdo -> prepare($sql);
$stmt -> bindParam(':meu_id', $meu_id);
$stmt -> bindParam(':outro_id', $outro_id);
$stmt -> execute();

$mensagens = $stmt -> fetchALL(PDO::FETCH_ASSOC);

echo json_encode($mensagens);


?>