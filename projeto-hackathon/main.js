const mural = document.getElementById("mural");
const form = document.getElementById("formMensagem");
const inputTexto = document.getElementById("texto");


// 1. Função que bate no PHP e traz as mensagens (READ)
function carregarMensagens() {
    fetch('ler.php?t=' + Date.now())
        .then(resposta => resposta.json())
        .then(dados => {
            console.log("Total de mensagens recebidas:", dados.length);
            
            let htmlTemporario = '';

            dados.forEach((msg, index) => {
                console.log(`Desenhando mensagem ${index}:`, msg.texto);
                
                htmlTemporario += `
                    <div class="mensagens">
                        <h5 class="texto">${msg.texto}</h5>
                        <small class="nome">yasmin</small>
                        <small class="hora">${msg.hora}</small>
                    </div>`;
            });

            const muralElemento = document.getElementById("mural");
            if (muralElemento) {
                muralElemento.innerHTML = htmlTemporario;
            } else {
                console.error("Erro: Não encontrei o elemento com id='mural' no HTML!");
            }
        })
        .catch(erro => console.error("Erro ao processar JSON:", erro));
}
// 2. Intercepta o envio do formulário (CREATE)
form.addEventListener('submit', function(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append('texto', inputTexto.value);


    fetch('salvar.php', {
        method: 'POST',
        body: formData
    })
    .then(resposta => {
        if (resposta.ok) {
            console.log("Mensagem salva com sucesso!");
            inputTexto.value = ''; // Limpa o campo de texto
            carregarMensagens(); 
        } else {
            console.error("Erro no servidor ao salvar.");
        }
    })
    .catch(erro => console.error("Erro na requisição de envio:", erro));
});

// 3. Atualiza a cada 2s
setInterval(carregarMensagens, 2000);

// Inicia a primeira carga
carregarMensagens();