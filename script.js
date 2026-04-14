        const API_BASE = "https://projeto-academia-hazel.vercel.app";
        
        // Controle de Exibição
        function checkAuth() {
            const token = localStorage.getItem('titan_token');
            if (token) {
                document.getElementById('loginSection').classList.add('hidden');
                document.getElementById('adminSection').classList.remove('hidden');
                document.getElementById('userInfo').classList.remove('hidden');
                carregarClientes();
            }
        }

        // Login
        document.getElementById('loginForm').onsubmit = async (e) => {
            e.preventDefault();
            const usuario = document.getElementById('usuario').value;
            const senha = document.getElementById('password').value;

            try {
                const res = await fetch(`${API_BASE}/login`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario, senha })
                });
                const data = await res.json();
                if (res.ok) {
                    localStorage.setItem('titan_token', data.access_token);
                    checkAuth();
                } else {
                    alert('Erro: Credenciais Inválidas');
                }
            } catch (err) { alert('Erro ao conectar com a API'); }
        };

        // Carregar Lista
        async function carregarClientes() {
            const token = localStorage.getItem('titan_token');
            try {
                const res = await fetch(`${API_BASE}/clientes`, {
                    headers: { 'Authorization': `Bearer ${token}` }
                });
                if (res.status === 401) return logout();
                
                const clientes = await res.json();
                document.getElementById('totalClientes').innerText = clientes.length;
                
                const tbody = document.getElementById('tabelaClientes');
                tbody.innerHTML = clientes.map(c => `
                    <tr class="table-row border-b border-zinc-800/50">
                        <td class="py-4 font-mono text-zinc-400">${c.cpf}</td>
                        <td class="py-4 font-bold text-white">${c.nome}</td>
                        <td class="py-4">
                            <span class="px-2 py-1 rounded-sm text-[10px] font-bold uppercase ${c.autorizado ? 'bg-green-900/30 text-green-500' : 'bg-red-900/30 text-red-500'}">
                                ${c.autorizado ? 'Ativo' : 'Bloqueado'}
                            </span>
                        </td>
                        <td class="py-4 text-right">
                            <button onclick="deletarCliente('${c.cpf}')" class="text-zinc-600 hover:text-red-500 transition-colors">
                                <i class="fas fa-trash"></i>
                            </button>
                        </td>
                    </tr>
                `).join('');
            } catch (err) { console.error('Erro ao carregar clientes'); }
        }

        // Adicionar Cliente
        document.getElementById('clienteForm').onsubmit = async (e) => {
            e.preventDefault();
            const token = localStorage.getItem('titan_token');
            const novoCliente = {
                cpf: document.getElementById('cpf').value,
                nome: document.getElementById('nome').value,
                autorizado: document.getElementById('autorizado').value === "true"
            };

            const res = await fetch(`${API_BASE}/clientes`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(novoCliente)
            });

            if (res.ok) {
                e.target.reset();
                carregarClientes();
            } else {
                alert('Erro ao cadastrar. Verifique se o CPF já existe.');
            }
        };

        // Deletar Cliente
        async function deletarCliente(cpf) {
            if (!confirm('Deseja realmente remover este aluno?')) return;
            const token = localStorage.getItem('titan_token');
            await fetch(`${API_BASE}/clientes/${cpf}`, {
                method: 'DELETE',
                headers: { 'Authorization': `Bearer ${token}` }
            });
            carregarClientes();
        }

        function logout() {
            localStorage.removeItem('titan_token');
            location.reload();
        }

        window.onload = checkAuth;
