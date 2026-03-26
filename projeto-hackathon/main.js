const mural = document.getElementById("mural");
const form = document.getElementById("formMensagem");
const inputTexto = document.getElementById("texto");
const contadorElemento = document.getElementById('contador'); 
const limite = 500;
let ultimaQuantidade = 0;
let destinatarioAtual = null; //e um espaço na memoria para guardar o ID da pessoa com quem voce clicou pra conversar
let intervaloPrivado = null; //serve para controlar o relogio


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
                        <small class="nome">${msg.nome || 'Visitante'}</small> 
                        <small class="hora">${msg.hora}</small>
                        <br>
                        <button onclick="abrirChatPrivado(${msg.id}, '${msg.nome}')" style="cursor:pointer; color: blue;">
                            Conversar no Privado
                        </button>
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
            contadorElemento.textContent = `${limite}`;
            carregarMensagens(); 
        } else { 
            alert("Erro: " + dados.mensagem); 
        } 
    }) 
    .catch(erro => console.error("Erro no envio:", erro));
});


//criar funçao para enviar(privado)
function enviarPrivado(idDestinatario, textoMensagem){
    if (!idDestinatario || idDestinatario === "Anonimo") {
        console.error("Erro: ID do destinatário inválido!");
        alert("Erro ao identificar o destinatário. Tente clicar novamente no botão 'Conversar'.");
        return;
    }

    let formData = new FormData();
    formData.append('destinatario', idDestinatario);
    formData.append('mensagem', textoMensagem);

    fetch('enviar_mensagens.php', {
        method: "POST",
        body: formData
    })
    .then(resposta => resposta.json())
    .then(dados => {
        if (dados.sucesso) {
            console.log("Mensagem enviada com sucesso!");
            carregarMensagensPrivadas();
        } else {
            console.error("Erro no PHP:", dados.erro);
        }
    })
    .catch(erro => console.error("Erro na requisição:", erro));
   
}

document.getElementById('enviar_privado').addEventListener('click', () => {
    const input = document.getElementById('texto_privado');
    const texto = input.value;

    if(texto !== "" && destinatarioAtual !== null){
        enviarPrivado(destinatarioAtual, texto);
        input.value= "";

        setTimeout(carregarMensagensPrivadas, 300)
    }
})

function carregarMensagensPrivadas(){
    console.log(destinatarioAtual)
    if(!destinatarioAtual) return;

    fetch(`ler_mensagens.php?destinatario=${destinatarioAtual}`)
        .then(res => res.json())
        .then(mensagens => {
            console.log("Dados que vieram do PHP:", mensagens); // ISSO VAI TE MOSTRAR O ERRO
            const muralPrivado = document.getElementById('mural_privado');
            if (!muralPrivado) return; // Garante que a div existe
            
            if (mensagens.length === 0) {
                muralPrivado.innerHTML = "<small>Nenhuma mensagem ainda...</small>";
                return;
            }
        
            let html = '';
            mensagens.forEach(msg => {
               
                const souEu = String(msg.remetente) !== String(destinatarioAtual);
                const alinhamento = souEu ? 'justify-content: flex-end;' : 'justify-content: flex-start;';
                const corBalao = souEu ? '#14213d' : '#ffffff';
                const margem = souEu ? 'margin-left: 50px;' : 'margin-right: 50px;';
            
                html += `
                    <div style="display: flex; ${alinhamento} margin-bottom: 10px; width: 100%;">
                        <div style="padding: 10px; border-radius: 15px; background-color: ${corBalao}; 
                                    max-width: 70%; ${margem} box-shadow: 0 1px 2px rgba(0,0,0,0.1); border: 1px solid #ddd;">
                            <p style="margin: 0; font-family: sans-serif; font-size: 14px; color: #333;">
                                ${msg.mensagem}
                            </p>
                            <small style="font-size: 10px; color: #999; display: block; text-align: right; margin-top: 5px;">
                                ${new Date(msg.data_envio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </small>
                        </div>
                    </div>`;
            });
            muralPrivado.innerHTML = html;
            muralPrivado.scrollTop = muralPrivado.scrollHeight;
        })
}

function abrirChatPrivado(id,nome){
    destinatarioAtual = id; //guarda o ID na memoria
    //mostra a div na janela 
    const janela = document.getElementById('janela_privada');
    
    if(janela){
        janela.style.display = "block";
    }else {
        console.error("Erro: A div 'janela_privada' não foi encontrada no HTML!");
    }
    //coloca o nome da pessoa no titulo
    document.getElementById('nome_titulo').textContent = nome;

    //limpa o relogio antigo e começa um novo para abrir o chat privado
    if(intervaloPrivado) clearInterval(intervaloPrivado);
    carregarMensagensPrivadas();
    intervaloPrivado = setInterval(carregarMensagensPrivadas, 2000)
}

setInterval(carregarMensagens, 2000);
carregarMensagens();