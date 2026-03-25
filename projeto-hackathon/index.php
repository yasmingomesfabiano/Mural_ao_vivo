<?php
session_start();
require_once 'conexao.php';

    if(!isset($_SESSION['id_usuario'])){
        header('Location: login.php');
        exit();
    }

?>

<!DOCTYPE html>
<html lang="pt-br">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mural Ao Vivo - Hackathon</title>
    <link rel="stylesheet" href="style.css">
</head>
<body background-color="">
    <div class="container">
      
        <form id="formMensagem" class="form">
            <<input type="text" name="texto" id="texto" class="inputtexto" 
                placeholder="Envie sua mensagem..." required maxlength="500" autocomplete='off'>
            <button type="submit" class="button">Enviar</button>
            <span id="contador">500</span>
            <span></span>
        </form>

        <div id="mural" class="mural"></div>
    </div>
    

    <script src="main.js"></script>
</html>