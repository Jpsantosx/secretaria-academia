// ==========================================
// CONFIGURAÇÕES GERAIS DA API
// ==========================================
const API_BASE_URL = 'https://projeto-academia-hazel.vercel.app';

// ==========================================
// REFERÊNCIAS DO DOM
// ==========================================
const loginSection = document.getElementById('loginSection');
const adminSection = document.getElementById('adminSection');
const loginForm = document.getElementById('loginForm');
const btnLogout = document.getElementById('btnLogout');
const userInfo = document.getElementById('userInfo');
const loginError = document.getElementById('loginError');
const userEmailSpan = document.getElementById('userEmail');

const clienteForm = document.getElementById('clienteForm');
const tabelaClientes = document.getElementById('tabelaClientes');
const totalClientesEl = document.getElementById('totalClientes');
const btnCancelar = document.getElementById('btnCancelar');
const formTitle = document.getElementById('formTitle');

// ==========================================
// ESTADO DA APLICAÇÃO
// ==========================================
let tokenAtual = localStorage.getItem('adminToken') || null;
let clientes = [];

function iniciarApp() {
    if (tokenAtual) {
        mostrarPainelAdmin();
        carregarClientes();
    } else {
        mostrarLogin();
    }
}

// ==========================================
// 1. AUTENTICAÇÃO
// ==========================================
loginForm.addEventListener('submit', async (e) => {
    e.preventDefault(); 
    
    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('password').value;

    try {
        const resposta = await fetch(`${API_BASE_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ usuario, senha })
        });

        if (resposta.ok) {
            const dados = await resposta.json(); 
            tokenAtual = dados.token;
            localStorage.setItem('adminToken', tokenAtual); 
            
            loginForm.reset(); 
            loginError.classList.add('hidden');
            mostrarPainelAdmin();
            carregarClientes(); 
        } else {
            loginError.classList.remove('hidden');
        }
    } catch (erro) {
        console.error("Erro:", erro);
        alert("Não foi possível conectar ao servidor.");
    }
});

btnLogout.addEventListener('click', () => {
    tokenAtual = null;
    localStorage.removeItem('adminToken');
    mostrarLogin(); 
});

// ==========================================
// 2. CRUD: READ
// ==========================================
async function carregarClientes() {
    try {
        const resposta = await fetch(`${API_BASE_URL}/clientes`);
        if (resposta.ok) {
            clientes = await resposta.json(); 
            renderizarTabela(); 
        }
    } catch (erro) {
        console.error("Erro ao carregar clientes:", erro);
    }
}

function renderizarTabela() {
    tabelaClientes.innerHTML = ''; 
    totalClientesEl.textContent = clientes.length;

    clientes.forEach(cliente => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td class="px-6 py-4 text-sm text-gray-800">${cliente.nome}</td>
            <td class="px-6 py-4 text-sm text-gray-600">${cliente.cpf}</td>
            <td class="px-6 py-4 text-sm">
                <span class="${cliente.autorizado ? 'text-green-600' : 'text-red-600'}">
                    ${cliente.autorizado ? 'Autorizado' : 'Bloqueado'}
                </span>
            </td>
            <td class="px-6 py-4 text-right text-sm font-medium">
                <button onclick="editarCliente(${cliente.id})" class="text-indigo-600 hover:text-indigo-900 mr-3">Editar</button>
                <button onclick="deletarCliente(${cliente.id})" class="text-red-600 hover:text-red-900">Excluir</button>
            </td>
        `;
        tabelaClientes.appendChild(tr);
    });
}

// ==========================================
// 3. CRUD: CREATE e UPDATE
// ==========================================
clienteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const idRaw = document.getElementById('clienteId').value;
    const clienteData = { 
        nome: document.getElementById('nome').value, 
        cpf: String(document.getElementById('cpf').value), 
        autorizado: document.getElementById('autorizado').checked 
    };

    try {
        let url = `${API_BASE_URL}/clientes`;
        let metodoHTTP = 'POST'; 

        if (idRaw) {
            url = `${API_BASE_URL}/clientes/${parseInt(idRaw)}`;
            metodoHTTP = 'PUT'; 
        }

        const respostaApi = await fetch(url, {
            method: metodoHTTP,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${tokenAtual}`
            },
            body: JSON.stringify(clienteData)
        });

        if (respostaApi.ok) {
            alert(idRaw ? "Cliente atualizado!" : "Cliente cadastrado!");
            limparFormulario();
            carregarClientes(); 
        } else {
            const erro = await respostaApi.json();
            alert("Erro: " + (erro.error || "Falha na operação"));
        }
    } catch (erro) {
        console.error("Erro na requisição:", erro);
    }
});

function editarCliente(id) {
    const cliente = clientes.find(c => c.id === id); 
    if (cliente) {
        document.getElementById('clienteId').value = cliente.id;
        document.getElementById('nome').value = cliente.nome;
        document.getElementById('cpf').value = cliente.cpf;
        document.getElementById('autorizado').checked = cliente.autorizado;
        formTitle.textContent = "Editar Cliente";
        btnCancelar.classList.remove('hidden');
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

async function deletarCliente(id) {
    if (!confirm("Excluir este cliente?")) return;
    try {
        const resposta = await fetch(`${API_BASE_URL}/clientes/${parseInt(id)}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${tokenAtual}` }
        });
        if (resposta.ok) carregarClientes(); 
    } catch (erro) {
        console.error(erro);
    }
}

function limparFormulario() {
    clienteForm.reset();
    document.getElementById('clienteId').value = '';
    formTitle.textContent = "Novo Cliente";
    btnCancelar.classList.add('hidden');
}

btnCancelar.addEventListener('click', limparFormulario);

function mostrarLogin() {
    loginSection.classList.remove('hidden');
    adminSection.classList.add('hidden');
    userInfo.classList.add('hidden');
}

function mostrarPainelAdmin() {
    loginSection.classList.add('hidden');
    adminSection.classList.remove('hidden');
    userInfo.classList.remove('hidden');
    userEmailSpan.textContent = "Admin Gym"; 
}

iniciarApp();