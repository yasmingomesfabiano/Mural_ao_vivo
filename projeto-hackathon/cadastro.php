<?php
require_once 'conexao.php';

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $nome = $_POST['nome'] ?? '';
    $email = $_POST['email'] ?? '';
    $senha = $_POST['senha'] ?? '';

    if(empty($nome)|empty($email)|empty($senha)){
        die ("Todos os dados são obrigatórios!");
    }

    //senha criptografada

    $senhaHash = password_hash($senha, PASSWORD_DEFAULT);

    try{
        $sql = "INSERT INTO usuarios(nome, email,senha_hash) VALUES (:nome, :email, :senha)";
        $stmt = $pdo->prepare($sql);

        $stmt -> bindParam(':nome', $nome);
        $stmt -> bindParam(':email', $email);
        $stmt -> bindParam(':senha', $senhaHash);

        if($stmt -> execute()){
            echo "Usuário cadastrado";
        }
    }catch(PDOEException $e){
        echo "Erro ao cadastrar" . $e -> getMessage();
    }

}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Cadastro</title>
</head>
<body>
    <form action="" method="post">
        <input type="text" name="nome" id="nome" placeholder="Digite seu nome" require autocomplete='off'>
        <input type="email" name="email" id="email" placeholder="Digite seu email" require autocomplete='off'>
        <input type="password" name="senha" id="senha" placeholder="Digite sua senha" require autocomplete='off'>
        <button type="submit">Cadastrar</button>
    </form>
    <a href="login.php">Voltar</a>
    
</body>
</html>