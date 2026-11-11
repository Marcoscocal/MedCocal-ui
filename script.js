// URL base da API hospedada no Render
const API_URL = 'https://medcocalapi.onrender.com';

// Garante que o usuário padrão de teste 'teste / 123' esteja sempre ativo
(function garantirUsuarioTeste() {
    const usuarioPadrao = {
        nome: 'Usuário Teste',
        email: 'teste',
        cpf: '000.000.000-00',
        celular: '(00) 00000-0000',
        senha: '123'
    };
    
    // Sempre define ou atualiza o usuarioPadrao de teste
    localStorage.setItem('usuarioTestePadrao', JSON.stringify(usuarioPadrao));
})();

// Proteção de Acesso às rotas internas
(function protegerRotas() {
    const usuarioLogado = localStorage.getItem('funcionarioLogado');
    const paginaAtual = window.location.pathname.split('/').pop();

    const paginasPublicas = ['login.html', 'cadastro.html', ''];

    if (!usuarioLogado && !paginasPublicas.includes(paginaAtual)) {
        window.location.href = 'login.html';
    }
})();

// 1. Cadastro de Funcionário (cadastro.html - Mantido com suporte local ou API se necessário)
const formCadastroFuncionario = document.getElementById('formCadastroFuncionario');
if (formCadastroFuncionario) {
    formCadastroFuncionario.addEventListener('submit', function(e) {
        e.preventDefault();

        const senha = document.getElementById('senhaFuncionario').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        const funcionario = {
            nome: document.getElementById('nomeFuncionario').value,
            email: document.getElementById('emailFuncionario').value,
            cpf: document.getElementById('cpfFuncionario').value,
            celular: document.getElementById('celularFuncionario').value,
            senha: senha
        };

        localStorage.setItem('funcionarioCadastrado', JSON.stringify(funcionario));
        alert('Conta de funcionário criada com sucesso! Faça login para continuar.');
        window.location.href = 'login.html';
    });
}

// 2. Login de Funcionário (login.html)
const formLogin = document.getElementById('formLogin');
if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailDigitado = document.getElementById('loginEmail').value.trim();
        const senhaDigitada = document.getElementById('loginSenha').value.trim();

        // Busca tanto o usuário de teste padrão quanto eventuais cadastros manuais
        const usuarioPadrao = JSON.parse(localStorage.getItem('usuarioTestePadrao'));
        const funcionarioCadastrado = JSON.parse(localStorage.getItem('funcionarioCadastrado'));

        const ehUsuarioPadraoValido = usuarioPadrao && usuarioPadrao.email === emailDigitado && usuarioPadrao.senha === senhaDigitada;
        const ehUsuarioCadastradoValido = funcionarioCadastrado && funcionarioCadastrado.email === emailDigitado && funcionarioCadastrado.senha === senhaDigitada;

        if (ehUsuarioPadraoValido || ehUsuarioCadastradoValido) {
            localStorage.setItem('funcionarioLogado', 'true');
            alert('Login realizado com sucesso!');
            window.location.href = 'index.html';
        } else {
            alert('E-mail ou senha incorretos!');
        }
    });
}

// 3. Função de Logout (Sair)
function fazerLogout() {
    localStorage.removeItem('funcionarioLogado');
    alert('Sessão encerrada com sucesso!');
    window.location.href = 'login.html';
}

// 4. Cadastro de Paciente (index.html) - Integrado com a API do Render
const formCadastroPaciente = document.getElementById('formCadastroPaciente');
if (formCadastroPaciente) {
    formCadastroPaciente.addEventListener('submit', async function(e) {
        e.preventDefault();

        const paciente = {
            nome: document.getElementById('nomePaciente').value,
            email: document.getElementById('emailPaciente').value,
            senha: document.getElementById('senhaPaciente').value,
            telefone: document.getElementById('telefonePaciente').value,
            cpf: document.getElementById('cpfPaciente').value
        };

        try {
            const response = await fetch(`${API_URL}/pacientes`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(paciente)
            });

            if (response.ok) {
                alert('Paciente cadastrado com sucesso na API do Render!');
                formCadastroPaciente.reset();
            } else {
                alert('Erro ao cadastrar paciente. Verifique os dados.');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Não foi possível conectar com o servidor no Render.');
        }
    });
}

// 5. Cadastro de Médico (medicos.html) - Integrado com a API do Render
const formCadastroMedico = document.getElementById('formCadastroMedico');
if (formCadastroMedico) {
    formCadastroMedico.addEventListener('submit', async function(e) {
        e.preventDefault();

        const medico = {
            nome: document.getElementById('nomeMedico').value,
            crm: document.getElementById('crmMedico').value,
            especialidade: document.getElementById('especialidadeMedico').value,
            email: document.getElementById('emailMedico').value
        };

        try {
            const response = await fetch(`${API_URL}/medicos`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(medico)
            });

            if (response.ok) {
                alert('Médico cadastrado com sucesso na API do Render!');
                formCadastroMedico.reset();
            } else {
                alert('Erro ao cadastrar médico.');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Erro ao conectar com a API.');
        }
    });
}