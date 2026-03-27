<?php
session_start();
require_once 'conexao.php';


if(isset($_SESSION['id_usuario'])) {
    header("Location: index.php");
    exit();
}

if($_SERVER['REQUEST_METHOD'] === 'POST'){
    $email = $_POST['email'];
    $senha = $_POST['senha'];

   
    if(empty($email) || empty($senha)){
        $erro = "Preecher todos campos!";
    } 
    
    
    $sql = 'SELECT * FROM usuarios WHERE email = :email';
    $stmt = $pdo->prepare($sql);
    $stmt->bindParam(':email', $email); 
    $stmt->execute();
    $usuario = $stmt->fetch(PDO::FETCH_ASSOC);

  
    if($usuario && password_verify($senha, $usuario['senha_hash'])){
        $_SESSION['id_usuario'] = $usuario['id']; 
        $_SESSION['nome'] = $usuario['nome'];
    
        header("Location: index.php"); // Isso faz ele mudar de página!
        exit();
    } else {
       $erro = 'Email ou senha incorreto!';
    }
}
?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Login</title>
    <link rel="stylesheet" href="style.css">
</head>
<body>
    <form class="form_login" method="post">
        <h2>Email</h2>
        <input type="email" name="email" id="email" placeholder="Digite seu email" required autocomplete='off'>
        <h2>Senha</h2>
        <input type="password" name="senha" id="senha" placeholder="Digite sua senha" required autocomplete='off'>
        <button class="btn_enviar" type="submit">Entrar</button>
        <a class="btn_cadastro" href="cadastro.php">Cadastro</a>
    </form>

</body>
</html>