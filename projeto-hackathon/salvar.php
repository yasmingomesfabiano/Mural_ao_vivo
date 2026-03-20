<?php
require "conexao.php";

// Verifica se ambos os campos vieram
$texto = $_POST['texto'] ?? null;
$nome  = $_POST['nome']  ?? null;

if ($texto && $nome) {
    $texto = trim($texto);
    $nome  = trim($nome);

    // Inserir texto e nome no mesmo registro
    $stmt = $pdo->prepare("
        INSERT INTO mensagens (texto, nome) VALUES (:texto, :nome)
    ");
    $stmt->bindParam(":texto", $texto);
    $stmt->bindParam(":nome",  $nome);

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(['status' => 'sucesso']);
        exit;
    }
}
?>