<?php
session_start();
file_put_contents("teste_recebimento.txt", print_r($_POST, true));
require "conexao.php";

$texto = $_POST['texto'] ?? null;
$texto = trim($texto);
$usuario_id = $_SESSION['id_usuario'] ?? null;

if ($texto && $usuario_id) {
  
    $proibidas = ['feio', 'chato', 'burro'];
    $substituicao = '******';
    
 
    $textoCensurado = str_ireplace($proibidas, $substituicao, $texto);

    $textoFinal = htmlspecialchars($textoCensurado, ENT_QUOTES, 'UTF-8');

    $stmt = $pdo->prepare("INSERT INTO mensagens (texto) VALUES (:texto)");
    
    $stmt->bindParam(":texto", $textoFinal);

    $maximo = 500;
        if (mb_strlen($texto) > $maximo) {
        echo json_encode(['status' => 'erro', 'mensagem' => 'Atenção: Sua mensagem passou do limite de 500 caracteres.']);
        exit;
    }

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(['status' => 'sucesso']);
        exit;
    } else {
        http_response_code(400);
        echo json_encode(['status' => 'erro', 'motivo' => 'Dados incompletos']);
        exit;
    }
} else { 
    echo json_encode(['status' => 'erro', 'mensagem' => 'Requisição inválida ou campos vazios.']); 
}
?>