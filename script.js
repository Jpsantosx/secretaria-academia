const API = "https://projeto-academia-hazel.vercel.app";
let TOKEN = "";

// LOGIN
document.getElementById("loginForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const usuario = document.getElementById("usuario").value;
    const senha = document.getElementById("password").value;

    const res = await fetch(API + "/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: JSON.stringify({ usuario, senha })
    });

    if (!res.ok) {
        alert("Login inválido");
        return;
    }

    const data = await res.json();
    TOKEN = data.token;

    document.getElementById("loginSection").classList.add("hidden");
    document.getElementById("adminSection").classList.remove("hidden");
    document.getElementById("userInfo").classList.remove("hidden");

    carregarClientes();
});

// LOGOUT
function logout() {
    TOKEN = "";
    location.reload();
}

// LISTAR
async function carregarClientes() {
    const res = await fetch(API + "/clientes");
    const clientes = await res.json();

    document.getElementById("totalClientes").innerText = clientes.length;

    const tabela = document.getElementById("tabelaClientes");
    tabela.innerHTML = "";

    clientes.forEach(c => {
        tabela.innerHTML += `
            <tr class="table-row border-b border-zinc-800">
                <td class="py-3">${c.cpf}</td>
                <td>${c.nome}</td>
                <td>
                    <span class="${c.autorizado ? 'text-green-400' : 'text-red-400'}">
                        ${c.autorizado ? 'Ativo' : 'Bloqueado'}
                    </span>
                </td>
                <td class="text-right">
                    <button onclick="ativar/desativar(${c.id}, ${!c.autorizado})" class="text-yellow-400 mr-3">Toggle</button>
                    <button onclick="deletar(${c.id})" class="text-red-500">Del</button>
                </td>
            </tr>
        `;
    });
}

// CADASTRAR
document.getElementById("clienteForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const cpf = document.getElementById("cpf").value;
    const nome = document.getElementById("nome").value;
    const autorizado = document.getElementById("autorizado").value === "true";

    await fetch(API + "/clientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN
        },
        body: JSON.stringify({ cpf, nome, autorizado })
    });

    carregarClientes();
});

// DELETE
async function deletar(id) {
    if (!confirm("Deseja deletar?")) return;

    await fetch(API + "/clientes/" + id, {
        method: "DELETE",
        headers: {
            "Authorization": "Bearer " + TOKEN
        }
    });

    carregarClientes();
}

// TOGGLE
async function toggle(id, status) {
    await fetch(API + "/clientes/" + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN
        },
        body: JSON.stringify({ autorizado: status })
    });

    carregarClientes();
}
