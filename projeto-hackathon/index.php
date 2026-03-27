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
            <input type="text" name="texto" id="texto" class="inputtexto" 
                placeholder="Envie sua mensagem..." required maxlength="500" autocomplete='off'>
            <button type="submit" class="button_publico">Enviar</button>
    
            <span></span>
        </form>

        <div id="mural" class="mural"></div>
    </div>

    <div  class="janela_privada"   id="janela_privada" style="display:none; position:fixed; bottom:20px; right:20px; background:white; border:1px solid #000; padding:10px;">
        <h3>Conversa com: <span id="nome_titulo"></span></h3>
        <div id="mural_privado" style="height:150px; overflow-y:auto; border:1px solid #ccc; margin-bottom:10px;"></div>

        <input class="input_privado" type="text" id="texto_privado" placeholder="Digite...">
        <button id="enviar_privado">Enviar</button>
        <button class="btn_fechar" onclick="document.getElementById('janela_privada').style.display='none'">Fechar</button>
    </div>
    

    <script src="main.js"></script>
</html>