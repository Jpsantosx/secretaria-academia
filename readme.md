#  Titan Gym - Painel Administrativo

O **Titan Gym** é uma aplicação web voltada para a gestão simplificada de alunos. O sistema permite que administradores realizem login, cadastrem novos membros, monitorem o status de acesso (Ativo/Bloqueado) e gerenciem a base de dados em tempo real.

##  Tecnologias Utilizadas

O projeto foi construído com foco em performance e uma interface moderna de alto contraste:

* **Frontend**: HTML5.
* **Estilização**: Tailwind CSS (via CDN) para um design responsivo e utilitário.
* **Ícones**: Font Awesome 6.0.
* **Lógica de Client-side**: JavaScript Assíncrono (Fetch API).
* **Backend / API**: Comunicação com serviço hospedado na Vercel utilizando autenticação via Token.

##  Interface e Estética

O painel utiliza uma identidade visual robusta, caracterizada por:
* **Modo Escuro (Dark Mode)**: Fundo em tons de zinco e preto para reduzir a fadiga visual.
* **Destaques em Neon/Ouro**: Uso da cor `#FFC107` (Gym Gold) para botões e informações críticas.
* **Responsividade**: O layout se adapta de grades de 3 colunas para visualização em lista única em dispositivos móveis.

##  Funcionalidades

### 1. Autenticação Administrativa
* Sistema de login que consome um endpoint `/login`.
* Armazenamento temporário de **Token Bearer** para operações protegidas.

### 2. Gestão de Alunos
* **Cadastro**: Adição de novos alunos via CPF e Nome.
* **Listagem**: Visualização dinâmica da base de dados com contador de total de alunos.
* **Status em Tempo Real**: Indicadores visuais verdes (Ativo) e vermelhos (Bloqueado).

### 3. Operações de Dados (CRUD)
* **Editar**: Permite editar o nome do cliente
* **Alt-Status**: Alteração rápida entre "Ativo" e "Bloqueado" via método `PATCH`.
* **Exclusão**: Remoção de registros com confirmação de segurança.
* **Atualização**: Botão dedicado para sincronização manual com o servidor.

##  Estrutura de Arquivos

* `index.html`: Contém a estrutura da interface, seções de login e o painel principal.
* `script.js`: Gerencia as requisições para a API, manipulação do DOM e controle do estado de autenticação.

### Criado por Felipe Barros e João Pedro Stadler
