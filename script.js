const API_BASE_URL = 'https://projeto-academia-hazel.vercel.app';

let tokenAtual = localStorage.getItem('adminToken') || null;
let clientes = [];

const clienteForm = document.getElementById('clienteForm');
const tabelaClientes = document.getElementById('tabelaClientes');
const totalClientesEl = document.getElementById('totalClientes');

function iniciarApp() {
    if (tokenAtual) {
        carregarClientes();
    }
}

function isCpfValido(cpf) {
    return /^\d{11}$/.test(cpf);
}

// LOGIN
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    const usuario = document.getElementById('usuario').value;
    const senha = document.getElementById('password').value;

    const res = await fetch(`${API_BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ usuario, senha })
    });

    if (res.ok) {
        const data = await res.json();
        tokenAtual = data.token;
        localStorage.setItem('adminToken', tokenAtual);
        location.reload();
    } else {
        alert("Login inválido");
    }
});

// LISTAR
async function carregarClientes() {
    const res = await fetch(`${API_BASE_URL}/clientes`);
    clientes = await res.json();
    renderizar();
}

function renderizar() {
    tabelaClientes.innerHTML = "";
    totalClientesEl.textContent = clientes.length;

    clientes.forEach(c => {
        tabelaClientes.innerHTML += `
        <tr>
            <td>${c.cpf}</td>
            <td>${c.nome}</td>
            <td>
                <button onclick="editar(${c.id})">Editar</button>
                <button onclick="deletar(${c.id})">Excluir</button>
            </td>
        </tr>`;
    });
}

// SALVAR
clienteForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const id = document.getElementById('clienteId').value;

    const data = {
        nome: document.getElementById('nome').value,
        cpf: document.getElementById('cpf').value,
        autorizado: document.getElementById('autorizado').value === "true"
    };

    if (!isCpfValido(data.cpf)) {
        alert("CPF inválido");
        return;
    }

    let url = `${API_BASE_URL}/clientes`;
    let metodo = 'POST';

    if (id) {
        url += `/${id}`;
        metodo = 'PUT';
    }

    const res = await fetch(url, {
        method: metodo,
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${tokenAtual}`
        },
        body: JSON.stringify(data)
    });

    if (res.ok) {
        alert("Salvo!");
        clienteForm.reset();
        carregarClientes();
    } else {
        alert("Erro");
    }
});

// EDITAR
function editar(id) {
    const c = clientes.find(x => x.id === id);

    document.getElementById('clienteId').value = c.id;
    document.getElementById('nome').value = c.nome;
    document.getElementById('cpf').value = c.cpf;
    document.getElementById('autorizado').value = String(c.autorizado);
}

// DELETE
async function deletar(id) {
    await fetch(`${API_BASE_URL}/clientes/${id}`, {
        method: 'DELETE',
        headers: {
            'Authorization': `Bearer ${tokenAtual}`
        }
    });

    carregarClientes();
}

iniciarApp();