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

// 1. Cadastro Interno (Funcionário ou Médico) - (cadastro.html)
const formCadastroFuncionario = document.getElementById('formCadastroFuncionario');
if (formCadastroFuncionario) {
    formCadastroFuncionario.addEventListener('submit', async function(e) {
        e.preventDefault();

        const senha = document.getElementById('senhaFuncionario').value;
        const confirmarSenha = document.getElementById('confirmarSenha').value;

        if (senha !== confirmarSenha) {
            alert('As senhas não coincidem!');
            return;
        }

        const tipoUsuario = document.getElementById('tipoUsuario').value;
        
        const dadosUsuario = {
            nome: document.getElementById('nomeFuncionario').value,
            email: document.getElementById('emailFuncionario').value,
            cpf: document.getElementById('cpfFuncionario').value,
            celular: document.getElementById('celularFuncionario').value,
            senha: senha
        };

        // Direciona para a rota correta dependendo se escolheu Médico ou Funcionário
        const rotaAPI = tipoUsuario === 'medico' ? `${API_URL}/medicos` : `${API_URL}/funcionarios`;

        try {
            const response = await fetch(rotaAPI, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(dadosUsuario)
            });

            if (response.ok) {
                alert(`Cadastro de ${tipoUsuario} realizado com sucesso na API!`);
                window.location.href = 'login.html';
            } else {
                alert('Erro ao realizar o cadastro. Verifique os dados.');
            }
        } catch (error) {
            console.error('Erro de conexão:', error);
            alert('Erro ao conectar com a API no Render.');
        }
    });
}

// 2. Login de Funcionário/Médico (login.html)
const formLogin = document.getElementById('formLogin');
if (formLogin) {
    formLogin.addEventListener('submit', function(e) {
        e.preventDefault();

        const emailDigitado = document.getElementById('loginEmail').value.trim();
        const senhaDigitada = document.getElementById('loginSenha').value.trim();

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

// 5. Cadastro de Médico isolado (medicos.html) - Caso utilize a tela específica de médicos
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