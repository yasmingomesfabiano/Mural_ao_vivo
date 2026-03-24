const mural = document.getElementById("mural");
const form = document.getElementById("formMensagem");
const inputTexto = document.getElementById("texto");
const contadorElemento = document.getElementById('contador'); 
const limite = 500;
let ultimaQuantidade = 0;


inputTexto.addEventListener('input', () => {
    const totalDigitado = inputTexto.value.length;
    const restantes = limite - totalDigitado;

    contadorElemento.textContent = `${restantes}`;

  
    contadorElemento.style.color = restantes <= 10 ? 'red' : 'inherit';
});

function carregarMensagens() {
    fetch('ler.php?t=' + Date.now())
        .then(resposta => resposta.json())
        .then(dados => {
            let htmlTemporario = '';
            dados.forEach((msg) => {
                htmlTemporario += `
                    <div class="mensagens">
                        <h5 class="texto">${msg.texto}</h5>
                        <small class="nome">yasmin</small>
                        <small class="hora">${msg.hora}</small>
                    </div>`;
            });

            if (mural) {
                mural.innerHTML = htmlTemporario;
                if (dados.length > ultimaQuantidade) {
                    mural.scrollTop = mural.scrollHeight;
                    ultimaQuantidade = dados.length; 
                }
            }
        })
        .catch(erro => console.error("Erro ao carregar:", erro));
}

form.addEventListener('submit', function(e) {
    e.preventDefault();

    let formData = new FormData();
    formData.append('texto', inputTexto.value);

    fetch('salvar.php', {
        method: 'POST',
        body: formData
    })
    .then(resposta => resposta.json())
    .then(dados => { 
        if (dados.status === 'sucesso') { 
            inputTexto.value = ''; 
            contadorElemento.textContent = `${limite} caracteres restantes`;
            carregarMensagens(); 
        } else { 
            alert("Erro: " + dados.mensagem); 
        } 
    }) 
    .catch(erro => console.error("Erro no envio:", erro));
});

setInterval(carregarMensagens, 2000);
carregarMensagens();