// ================= MODO ESCURO =================
const botaoTema = document.getElementById("meu-switch");
const htmlElement = document.documentElement;
 
if (localStorage.getItem("tema") === "dark_mode") {
  htmlElement.classList.add("dark_mode");
  botaoTema.checked = true; // mantém o switch alinhado com o tema salvo
}
 
botaoTema.addEventListener("change", () => {
  htmlElement.classList.toggle("dark_mode", botaoTema.checked);
  localStorage.setItem("tema", botaoTema.checked ? "dark_mode" : "light");
});
 
// ================= MODAL =================
const modal = document.getElementById("cadastro");
const btnFechar = document.getElementById("fecharModal");
 
// abre pelos dois links (desktop e menu mobile)
document.querySelectorAll(".abrir-modal").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();                       // não deixa o "#" subir a página
    document.body.classList.add("modal-aberto"); // desfoca o resto do site
    modal.showModal();
  });
});
 
// botão X
btnFechar.addEventListener("click", () => modal.close());
 
// clicar fora do modal fecha
modal.addEventListener("click", (event) => {
  const rect = modal.getBoundingClientRect();
  const dentro =
    rect.top <= event.clientY && event.clientY <= rect.bottom &&
    rect.left <= event.clientX && event.clientX <= rect.right;
  if (!dentro) modal.close();
});
 
// qualquer jeito de fechar (X, Esc, clique fora, Cadastrar) tira o desfoque
modal.addEventListener("close", () => {
  document.body.classList.remove("modal-aberto");
});
 

function formatarCep(valor) {
    let v = valor.replace(/\D/g, "").slice(0, 8);

    if (v.length > 5) {
        return v.slice(0, 2) + "." + v.slice(2, 5) + "-" + v.slice(5);
    } else if (v.length > 2) {
        return v.slice(0, 2) + "." + v.slice(2);
    }
    return v;
}

document.addEventListener("DOMContentLoaded", function () {
    const cep = document.getElementById("cep");
    const numero = document.getElementById("numero");

    if (cep) {
        cep.addEventListener("input", function () {
            cep.value = formatarCep(cep.value);
        });
    }

    if (numero) {
        numero.addEventListener("input", function () {
            numero.value = numero.value.replace(/\D/g, "").slice(0, 6);
        });
    }
});

/* ================= DELIVERY: validação do endereço + iFood ================= */
(function () {
    const LINK_IFOOD = 'https://www.ifood.com.br/'; // troque pelo link da loja no iFood

    const form = document.querySelector('.sec01 form');
    const cep = document.getElementById('cep');
    if (!form || !cep) return; // só roda na página de delivery

    // ordem dos inputs: Nome, Rua, Bairro, N°, CEP, Complemento
    const inputs = form.querySelectorAll('input');
    [inputs[0], inputs[1], inputs[2], inputs[3], cep].forEach(campo => { campo.required = true; });
    inputs[0].minLength = 3;

    function validarCep() {
        const digitos = cep.value.replace(/\D/g, '');
        cep.setCustomValidity(digitos.length === 8 ? '' : 'Digite um CEP com 8 números.');
    }
    cep.addEventListener('input', validarCep);
    validarCep();

    // o navegador já bloqueia o envio e mostra o aviso; este código só roda se estiver tudo certo
    form.addEventListener('submit', e => {
        e.preventDefault();
        alert('Endereço cadastrado com sucesso!');
        form.reset();
        validarCep();
    });

    const botaoIfood = document.querySelector('.sec02 .button');
    if (botaoIfood) {
        botaoIfood.addEventListener('click', () => window.open(LINK_IFOOD, '_blank', 'noopener'));
    }
})();

/* ================= MODAL: senhas iguais + olhinho ================= */
(function () {
    const form = document.querySelector('.form-cadastro');
    if (!form) return;

    const [senha, confirma] = form.querySelectorAll('input[type="password"]');
    senha.minLength = 6;

    // se as senhas forem diferentes, o navegador bloqueia o envio e mostra o aviso
    function conferir() {
        confirma.setCustomValidity(confirma.value !== senha.value ? 'As senhas não são iguais.' : '');
    }
    senha.addEventListener('input', conferir);
    confirma.addEventListener('input', conferir);

    // botão de mostrar/ocultar em cada campo de senha
    [senha, confirma].forEach(campo => {
        const caixa = document.createElement('div');
        caixa.className = 'campo-senha';
        campo.parentNode.insertBefore(caixa, campo);
        caixa.appendChild(campo);

        const olho = document.createElement('button');
        olho.type = 'button';
        olho.className = 'btn-olho';
        olho.textContent = '👁';
        olho.setAttribute('aria-label', 'Mostrar senha');
        olho.addEventListener('click', () => {
            const estavaOculta = campo.type === 'password';
            campo.type = estavaOculta ? 'text' : 'password';
            olho.textContent = estavaOculta ? '🙈' : '👁';
            olho.setAttribute('aria-label', estavaOculta ? 'Ocultar senha' : 'Mostrar senha');
        });
        caixa.appendChild(olho);
    });
})();

// ================= CARRINHO =================
const CHAVE_CARRINHO = 'carrinhoOtakuSenku';
const TAXA_ENVIO = 0; // valor do frete: mude aqui se quiser cobrar entrega

function lerCarrinho() {
    try {
        return JSON.parse(localStorage.getItem(CHAVE_CARRINHO)) || [];
    } catch {
        return [];
    }
}

function salvarCarrinho(carrinho) {
    localStorage.setItem(CHAVE_CARRINHO, JSON.stringify(carrinho));
}

function formatarPreco(valor) {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

// --- botões "Carrinho" dos produtos (cardápio) ---
const CAIXAS = '.caixa-produtos, .caixa-produtos2, .caixa-produtos4, .caixa-produtos5, .sanji';

document.querySelectorAll(
    '.caixa-produtos a, .caixa-produtos2 a, .caixa-produtos4 a, .caixa-produtos5 a, .sanji a'
).forEach(botao => {
    botao.addEventListener('click', e => {
        e.preventDefault(); // não deixa o href="" recarregar a página

        const caixa = botao.closest(CAIXAS);
        const titulos = caixa.querySelectorAll('h2');

        const nome = titulos[0].textContent.trim();
        const preco = parseFloat(
            titulos[1].textContent.replace('R$', '').replace(',', '.')
        );
        const img = caixa.querySelector('img').getAttribute('src');

        const carrinho = lerCarrinho();
        const existente = carrinho.find(item => item.nome === nome);

        if (existente) {
            existente.qtd++;
        } else {
            carrinho.push({ nome, preco, img, qtd: 1 });
        }
        salvarCarrinho(carrinho);

        // feedback rápido no botão
        const textoOriginal = botao.textContent;
        botao.textContent = 'Adicionado ✓';
        setTimeout(() => (botao.textContent = textoOriginal), 1000);
    });
});

// --- página do carrinho ---
const listaCarrinho = document.getElementById('lista-carrinho');

if (listaCarrinho) {
    function renderizarCarrinho() {
        const carrinho = lerCarrinho();
        let total = 0;
        listaCarrinho.innerHTML = '';

        if (carrinho.length === 0) {
            listaCarrinho.innerHTML = '<p>Seu carrinho está vazio.</p>';
        }

        carrinho.forEach((item, i) => {
            total += item.preco * item.qtd;

            const card = document.createElement('div');
            card.className = 'produtos';
            card.innerHTML = `
                <img src="${item.img}" alt="">
                <div class="asss">
                    <h2>${item.nome}</h2>
                    <h2>${formatarPreco(item.preco)}</h2>
                    <div class="addd">
                        <button data-acao="menos" data-i="${i}">−</button>
                        <span>${item.qtd}</span>
                        <button data-acao="mais" data-i="${i}">+</button>
                    </div>
                    <button class="apagar" data-acao="apagar" data-i="${i}">🗑 Remover</button>
                </div>
            `;
            listaCarrinho.appendChild(card);
        });

        const envio = carrinho.length > 0 ? TAXA_ENVIO : 0;
        document.getElementById('subtotal').textContent = formatarPreco(total);
        document.getElementById('envio').textContent = formatarPreco(envio);
        document.getElementById('total').textContent = formatarPreco(total + envio);
    }

    // botões +, − e Remover
    listaCarrinho.addEventListener('click', e => {
        const botao = e.target.closest('button[data-acao]');
        if (!botao) return;

        const carrinho = lerCarrinho();
        const i = Number(botao.dataset.i);

        if (botao.dataset.acao === 'mais') carrinho[i].qtd++;
        if (botao.dataset.acao === 'menos') carrinho[i].qtd--;
        if (botao.dataset.acao === 'apagar') carrinho.splice(i, 1); // tira o item inteiro

        // se chegou a 0, remove o item
        const atualizado = carrinho.filter(item => item.qtd > 0);
        salvarCarrinho(atualizado);
        renderizarCarrinho();
    });

    renderizarCarrinho();
}