<?php
session_start();
require_once 'conexao.php';

if(!isset($_SESSION['id_usuario'])){
    die ('Acesso negado');
}

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $remetente = $_SESSION['id_usuario'];
    $destinatario = $_POST['destinatario'];
    $mensagem = $_POST['mensagem'];

    if(!empty($mensagem) && !empty($destinatario)){
        $sql =  "INSERT INTO chat_privado (remetente, destinatario, mensagem) VALUES(:remetente, :destinatario, :msg)";
        
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':remetente', $remetente);
        $stmt->bindParam(':destinatario', $destinatario);
        $stmt->bindParam(':msg', $mensagem);

       

        if($stmt->execute()){
            echo json_encode(['sucesso' => true]);
        }else{
            echo json_encode(['sucesso' => false, 'erro' => 'Erro ao executar no banco']);
        }
        exit();
        

    }


}



?>