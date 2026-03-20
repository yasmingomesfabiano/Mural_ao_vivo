const mural = document.getElementById("mural");
const form = document.getElementById("formMensagem");
const inputTexto = document.getElementById("texto");
const inputName = document.getElementById("nome");

// 1. Função que bate no PHP e traz as mensagens (READ)
function carregarMensagens() {
    fetch('ler.php')
        .then(resposta => resposta.json())
        .then(dados => {
            mural.innerHTML = ''; // Limpa antes de desenhar

            dados.forEach(msg => {
                mural.innerHTML += `
                    <div class="mural">
                        <h5 class="texto">${msg.texto}</h5>
                        <small class="nome">${msg.nome}</small>
                        <small class="hora">Enviado às: ${msg.hora}</small>
                    </div>
                `;
            });
        })
        .catch(erro => console.error("Erro ao buscar dados:", erro));
}

// 2. Intercepta o envio do formulário (CREATE)
form.addEventListener('submit', function(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append('texto', inputTexto.value);
    formData.append('nome', inputName.value);
    fetch('salvar.php', {
        method: 'POST',
        body: formData
    }).then(() => {
        inputTexto.value = '';
        carregarMensagens();
    })
});


// 3. Atualiza a cada 2s
setInterval(carregarMensagens, 2000);

// Inicia a primeira carga
carregarMensagens();