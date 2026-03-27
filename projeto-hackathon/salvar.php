<?php
session_start();
file_put_contents("teste_recebimento.txt", print_r($_POST, true));
require "conexao.php";

$texto = $_POST['texto'] ?? null;
$texto = trim($texto);
$usuario_id = $_SESSION['id_usuario'] ?? null;


if (!$texto) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'O texto está vazio.']);
    exit;
}
if (!$usuario_id) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Sessão inválida. Faça login novamente.']);
    exit;
}

$proibidas = ['feio', 'chato', 'burro'];
$substituicao = '******';
$textoCensurado = str_ireplace($proibidas, $substituicao, $texto);
$textoFinal = htmlspecialchars($textoCensurado, ENT_QUOTES, 'UTF-8');


$maximo = 500;
if (mb_strlen($texto) > $maximo) {
    echo json_encode(['status' => 'erro', 'mensagem' => 'Atenção: Limite de 500 caracteres excedido.']);
    exit;
}


$stmt = $pdo->prepare("INSERT INTO mensagens (texto, usuario_id) VALUES (:texto, :uid)");

$stmt->bindParam(":texto", $textoFinal);
$stmt->bindParam(":uid", $usuario_id); 

if ($stmt->execute()) {
    http_response_code(200);
    echo json_encode(['status' => 'sucesso']);
    exit;
} else {
    http_response_code(400);
    echo json_encode(['status' => 'erro', 'motivo' => 'Erro ao executar no banco.']);
    exit;
}
?>