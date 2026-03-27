const mural = document.getElementById("mural");
const form = document.getElementById("formMensagem");
const inputTexto = document.getElementById("texto");

let ultimaQuantidade = 0;
let destinatarioAtual = null; 
let intervaloPrivado = null; 

function carregarMensagens() {
    fetch('ler.php?t=' + Date.now())
        .then(resposta => resposta.json())
        .then(dados => {
            let htmlTemporario = '';
            
            dados.forEach((msg) => {
                const idAutor = msg.usuario_id; 
                const nomeAutor = msg.nome || 'Visitante';

                htmlTemporario += `
                    <div class="mensagens">
                        <h5 class="texto">${msg.texto}</h5>
                        <small class="nome"><b>${nomeAutor}</b></small> 
                        <small class="hora">${msg.hora}</small>
                        <br>
                        ${idAutor ? `
                            <button class="btn-privado" onclick="abrirChatPrivado(${idAutor}, '${nomeAutor}')">
                                <i class="fas fa-comment-dots"></i> Conversar no Privado
                            </button>` : ''}
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
        .catch(erro => console.error("Erro ao carregar mural:", erro));
}

form.addEventListener('submit', function(e) {
    e.preventDefault();
    const texto = inputTexto.value.trim();
    if (texto === "") return;

    let formData = new FormData();
    formData.append('texto', texto);

    inputTexto.value = ''; // Limpa antes para UX imediata

    fetch('salvar.php', {
        method: 'POST',
        body: formData
    })
    .then(resposta => resposta.json())
    .then(dados => { 
        if (dados.status === 'sucesso') { 
            carregarMensagens(); 
        } else { 
            alert("Erro: " + dados.mensagem); 
        } 
    }) 
    .catch(erro => console.error("Erro no envio público:", erro));
});

function enviarPrivado(idDestinatario, textoMensagem){
    if (!idDestinatario || textoMensagem.trim() === "") return;

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
            carregarMensagensPrivadas();
        } else {
            console.error("Erro no PHP Privado:", dados.erro);
        }
    })
    .catch(erro => console.error("Erro na requisição privada:", erro));
}

document.getElementById('enviar_privado').addEventListener('click', () => {
    const input = document.getElementById('texto_privado');
    const texto = input.value;

    if(texto.trim() !== "" && destinatarioAtual !== null){
        enviarPrivado(destinatarioAtual, texto);
        input.value = "";
    }
});

function carregarMensagensPrivadas(){
    if(!destinatarioAtual) return;

    fetch(`ler_mensagens.php?destinatario=${destinatarioAtual}`)
        .then(res => res.json())
        .then(mensagens => {
            const muralPrivado = document.getElementById('mural_privado');
            if (!muralPrivado) return;
            
            if (mensagens.length === 0) {
                muralPrivado.innerHTML = "<small style='color: gray;'>Nenhuma mensagem ainda...</small>";
                return;
            }
        
            let html = '';
            mensagens.forEach(msg => {
                const souEu = String(msg.remetente) !== String(destinatarioAtual);
                const alinhamento = souEu ? 'justify-content: flex-end;' : 'justify-content: flex-start;';
                const corBalao = souEu ? '#14213d' : '#e9ecef';
                const corTexto = souEu ? '#ffffff' : '#333333';
                const raioBalao = souEu ? 'border-radius: 15px 15px 0px 15px;' : 'border-radius: 15px 15px 15px 0px;';
            
                html += `
                    <div style="display: flex; ${alinhamento} margin-bottom: 10px; width: 100%;">
                        <div style="padding: 10px; ${raioBalao} background-color: ${corBalao}; max-width: 80%; box-shadow: 0 1px 2px rgba(0,0,0,0.1); border: 1px solid #ddd;">
                            <p style="margin: 0; font-family: sans-serif; font-size: 14px; color: ${corTexto}; word-wrap: break-word;">
                                ${msg.mensagem}
                            </p>
                            <small style="font-size: 9px; color: ${souEu ? '#ccc' : '#999'}; display: block; text-align: right; margin-top: 5px;">
                                ${new Date(msg.data_envio).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                            </small>
                        </div>
                    </div>`;
            });
            muralPrivado.innerHTML = html;
            muralPrivado.scrollTop = muralPrivado.scrollHeight;
        })
        .catch(e => console.error("Erro ao ler privadas:", e));
}

function abrirChatPrivado(id, nome){
    destinatarioAtual = id; 
    const janela = document.getElementById('janela_privada');
    if(janela) janela.style.display = "block";
    document.getElementById('nome_titulo').textContent = nome;

    if(intervaloPrivado) clearInterval(intervaloPrivado);
    carregarMensagensPrivadas();
    intervaloPrivado = setInterval(carregarMensagensPrivadas, 2000);
}

setInterval(carregarMensagens, 3000);
carregarMensagens();