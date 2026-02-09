const STORAGE_KEY = 'mago_records_v1';
let recordes = [];
let ordemAtual = { coluna: 'pontos', direcao: 'desc' };

const dadosIniciais = [
    { id: 1, nick: "Mago_Merlin", tempo: 120, pontos: 5500, moedas: 45, inimigos: 30 },
    { id: 2, nick: "BubbleQueen", tempo: 95, pontos: 7200, moedas: 80, inimigos: 55 },
    { id: 3, nick: "ShadowCast", tempo: 150, pontos: 4100, moedas: 20, inimigos: 15 },
    { id: 4, nick: "Frodo_Bolha", tempo: 200, pontos: 3200, moedas: 10, inimigos: 10 },
    { id: 5, nick: "LunaMagica", tempo: 110, pontos: 6300, moedas: 60, inimigos: 40 }
];

document.addEventListener('DOMContentLoaded', () => {
    
    const menuBtn = document.getElementById('menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
        menuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            mobileMenu.classList.toggle('flex');
        });
    }

    const carousel = document.getElementById('carousel-inner');
    if (carousel) startAutoScroll(carousel);

    const tabelaCorpo = document.getElementById('tabela-corpo');
    if (tabelaCorpo) {
        carregarDados();    
        renderizarTabela(); 
        configurarModal();  
    }

    const formSupport = document.getElementById('form-support');
    const formRecord = document.getElementById('form-record');
    
    if (formSupport && formRecord) {
        
        window.toggleForm = function(type) {
            const btnSupport = document.getElementById('btn-support');
            const btnRecord = document.getElementById('btn-record');
            const successMsg = document.getElementById('form-success');

            successMsg.classList.add('hidden');

            if (type === 'support') {
                formSupport.classList.remove('hidden');
                formRecord.classList.add('hidden');
                
                btnSupport.className = "px-6 py-2 rounded-full text-sm font-bold transition-all bg-cyan-600 text-white shadow-lg";
                btnRecord.className = "px-6 py-2 rounded-full text-sm font-bold transition-all text-slate-400 hover:text-white";
            } else {
                formSupport.classList.add('hidden');
                formRecord.classList.remove('hidden');

                btnSupport.className = "px-6 py-2 rounded-full text-sm font-bold transition-all text-slate-400 hover:text-white";
                btnRecord.className = "px-6 py-2 rounded-full text-sm font-bold transition-all bg-yellow-600 text-white shadow-lg";
            }
        };

        restaurarSessao();

        configurarPersistencia(formSupport);
        configurarPersistencia(formRecord);

        formSupport.addEventListener('submit', (e) => lidarComEnvio(e, 'Suporte'));
        formRecord.addEventListener('submit', (e) => lidarComEnvio(e, 'Recorde'));
    }
});


function configurarPersistencia(form) {
    const inputs = form.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        input.addEventListener('input', () => {
            sessionStorage.setItem(input.name, input.value);
        });
    });
}

function restaurarSessao() {
    const inputs = document.querySelectorAll('input, textarea, select');
    inputs.forEach(input => {
        const valorGuardado = sessionStorage.getItem(input.name);
        if (valorGuardado) input.value = valorGuardado;
    });
}

function lidarComEnvio(e, tipo) {
    e.preventDefault();
    
    const successDiv = document.getElementById('form-success');
    const successText = document.getElementById('success-msg');
    
    if (tipo === 'Recorde') {
        const nick = e.target.querySelector('[name="recordNick"]').value;
        successText.innerHTML = `Obrigado, <strong class="text-yellow-300">${nick}</strong>! O teu recorde foi enviado para os escribas reais.`;
    } else {
        successText.innerHTML = "A tua mensagem mágica foi recebida! Responderemos em breve.";
    }

    successDiv.classList.remove('hidden');
    
    e.target.reset();
    const inputs = e.target.querySelectorAll('input, textarea, select');
    inputs.forEach(input => sessionStorage.removeItem(input.name));

    successDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
}


function startAutoScroll(element) {
    setInterval(() => {
        if (!element) return; 
        if (element.scrollLeft + element.offsetWidth >= element.scrollWidth - 10) {
            element.scrollTo({ left: 0, behavior: 'smooth' });
        } else {
            const card = element.querySelector('article');
            const cardWidth = card ? card.offsetWidth + 24 : 300; 
            element.scrollBy({ left: cardWidth, behavior: 'smooth' });
        }
    }, 5000);
}

function carregarDados() {
    const dadosGuardados = localStorage.getItem(STORAGE_KEY);
    if (dadosGuardados) {
        recordes = JSON.parse(dadosGuardados);
    } else {
        recordes = [...dadosIniciais];
        localStorage.setItem(STORAGE_KEY, JSON.stringify(recordes));
    }
}

function atualizarLocalStorage() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(recordes));
}

function renderizarTabela() {
    const tbody = document.getElementById('tabela-corpo');
    const msgVazia = document.getElementById('mensagem-vazia');
    if (!tbody) return;

    tbody.innerHTML = '';
    if (recordes.length === 0) {
        if(msgVazia) msgVazia.classList.remove('hidden');
        return;
    } else {
        if(msgVazia) msgVazia.classList.add('hidden');
    }

    recordes.forEach(recorde => {
        const tr = document.createElement('tr');
        tr.className = "hover:bg-white/10 transition border-b border-white/5";
        tr.innerHTML = `
            <td class="p-6 font-bold text-white">${recorde.nick} ${recorde.pontos > 9000 ? '🔥' : ''}</td>
            <td class="p-6">${recorde.tempo}s</td>
            <td class="p-6 font-bold text-cyan-400">${recorde.pontos}</td>
            <td class="p-6 hidden md:table-cell text-slate-400">${recorde.moedas}</td>
            <td class="p-6 hidden md:table-cell text-slate-400">⚔️ ${recorde.inimigos}</td>
            <td class="p-6 text-center flex justify-center gap-2">
                <button onclick="editarRecorde(${recorde.id})" class="text-cyan-400 hover:text-cyan-200 p-2 hover:bg-white/10 rounded transition">✏️</button>
                <button onclick="apagarRecorde(${recorde.id})" class="text-red-500 hover:text-red-300 p-2 hover:bg-white/10 rounded transition">🗑️</button>
            </td>
        `;
        tbody.appendChild(tr);
    });
}

function configurarModal() {
    const modal = document.getElementById('modal-registo');
    if (modal) {
        modal.addEventListener('click', (e) => {
            if (e.target === modal) fecharModal();
        });
    }
}

function abrirModal() {
    const modal = document.getElementById('modal-registo');
    const form = document.getElementById('form-recorde');
    if (modal && form) {
        modal.classList.remove('hidden');
        form.reset();
        document.getElementById('recorde-id').value = ''; 
    }
}

function fecharModal() {
    const modal = document.getElementById('modal-registo');
    if (modal) modal.classList.add('hidden');
}

function salvarRecorde(event) {
    event.preventDefault(); 
    const id = document.getElementById('recorde-id').value;
    const nick = document.getElementById('nick').value;
    const tempo = parseInt(document.getElementById('tempo').value);
    const pontos = parseInt(document.getElementById('pontos').value);
    const moedas = parseInt(document.getElementById('moedas').value);
    const inimigos = parseInt(document.getElementById('inimigos').value);

    if (tempo < 0 || pontos < 0 || moedas < 0 || inimigos < 0) {
        alert("Valores negativos não são permitidos na magia!");
        return;
    }

    if (id) {
        const index = recordes.findIndex(r => r.id == id);
        if (index !== -1) recordes[index] = { id: parseInt(id), nick, tempo, pontos, moedas, inimigos };
    } else {
        const novoRecorde = { id: Date.now(), nick, tempo, pontos, moedas, inimigos };
        recordes.push(novoRecorde);
    }
    atualizarLocalStorage();
    renderizarTabela();
    fecharModal();
}

function apagarRecorde(id) {
    if (confirm("Tens a certeza que queres banir este mago?")) {
        recordes = recordes.filter(r => r.id !== id);
        atualizarLocalStorage();
        renderizarTabela();
    }
}

function editarRecorde(id) {
    const recorde = recordes.find(r => r.id === id);
    if (recorde) {
        document.getElementById('recorde-id').value = recorde.id;
        document.getElementById('nick').value = recorde.nick;
        document.getElementById('tempo').value = recorde.tempo;
        document.getElementById('pontos').value = recorde.pontos;
        document.getElementById('moedas').value = recorde.moedas;
        document.getElementById('inimigos').value = recorde.inimigos;
        
        const modal = document.getElementById('modal-registo');
        if (modal) modal.classList.remove('hidden');
    }
}

function ordenarTabela(coluna) {
    if (ordemAtual.coluna === coluna) {
        ordemAtual.direcao = ordemAtual.direcao === 'asc' ? 'desc' : 'asc';
    } else {
        ordemAtual.coluna = coluna;
        ordemAtual.direcao = 'desc'; 
    }
    recordes.sort((a, b) => {
        let valorA = a[coluna];
        let valorB = b[coluna];
        if (typeof valorA === 'string') {
            valorA = valorA.toLowerCase();
            valorB = valorB.toLowerCase();
        }
        if (valorA < valorB) return ordemAtual.direcao === 'asc' ? -1 : 1;
        if (valorA > valorB) return ordemAtual.direcao === 'asc' ? 1 : -1;
        return 0;
    });
    renderizarTabela();
}