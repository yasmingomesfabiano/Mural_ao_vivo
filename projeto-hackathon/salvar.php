<?php
file_put_contents("teste_recebimento.txt", print_r($_POST, true));
require "conexao.php";

// Verifica se ambos os campos vieram
$texto = $_POST['texto'] ?? null;


if ($texto) {
    $texto = trim($texto);
 

    $texto = htmlspecialchars(trim($_POST['texto']));

    // Inserir texto e nome no mesmo registro
    $stmt = $pdo->prepare("
        INSERT INTO mensagens (texto) VALUES (:texto)
    ");
    $stmt->bindParam(":texto", $texto);
    

    if ($stmt->execute()) {
        http_response_code(200);
        echo json_encode(['status' => 'sucesso']);
        exit;
    }
} else {
    // Se chegar aqui, significa que o PHP recebeu algo vazio ou nulo
    http_response_code(400); // Bad Request
    echo json_encode(['status' => 'erro', 'motivo' => 'Dados incompletos']);
    exit;
}

?>