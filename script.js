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
                    <button onclick="editarNome(${c.id}, '${c.nome}')" class="text-blue-400 mr-3">Editar</button>
                    <button onclick="toggle(${c.id}, ${!c.autorizado})" class="text-yellow-400 mr-3">alt-status</button>
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

    const res = await fetch(API + "/clientes", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN
        },
        body: JSON.stringify({ cpf, nome, autorizado })
    });

    if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Erro ao cadastrar cliente.");
        return; // Interrompe a execução para não recarregar a lista à toa
    }

    carregarClientes();
});

// EDITAR NOME
async function editarNome(id, nomeAtual) {
    const novoNome = prompt("Digite o novo nome para o cliente:", nomeAtual);

    // Verifica se o usuário cancelou o prompt ou deixou em branco
    if (novoNome === null || novoNome.trim() === "" || novoNome === nomeAtual) {
        return; 
    }

    const res = await fetch(API + "/clientes/" + id, {
        method: "PATCH",
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + TOKEN
        },
        body: JSON.stringify({ nome: novoNome })
    });

    if (!res.ok) {
        const data = await res.json();
        alert(data.error || "Erro ao atualizar o nome.");
    } else {
        carregarClientes();
    }
}

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

// ALT-STATUS
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
