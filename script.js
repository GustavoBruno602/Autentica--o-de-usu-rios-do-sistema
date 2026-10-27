// Endereco da API local do JSON Server.
const API_URL = "http://localhost:3000/usuarios";

let formLogin = document.getElementById("formLogin");
let campoEmail = document.getElementById("email");
let campoSenha = document.getElementById("senha");
let campoPerfil = document.getElementById("perfil");
let mensagem = document.getElementById("mensagem");
let botaoEntrar = document.querySelector(".botao-entrar");

// Mostra ou esconde a senha.
document.getElementById("mostrarSenha").addEventListener("click", function () {
  if (campoSenha.type === "password") {
    campoSenha.type = "text";
    this.innerText = "Ocultar";
  } else {
    campoSenha.type = "password";
    this.innerText = "Mostrar";
  }
});

// Recupera o e-mail salvo anteriormente.
let emailSalvo = localStorage.getItem("retintaEmail");
if (emailSalvo) {
  campoEmail.value = emailSalvo;
  document.getElementById("lembrar").checked = true;
}

function mostrarMensagem(texto, tipo) {
  mensagem.innerText = texto;
  mensagem.className = "mensagem " + tipo;
}

// Consulta os usuários cadastrados no JSON Server.
formLogin.addEventListener("submit", async function (evento) {
  evento.preventDefault();

  let email = campoEmail.value.trim().toLowerCase();
  let senha = campoSenha.value;
  let perfil = campoPerfil.value;

  mostrarMensagem("", "");
  botaoEntrar.disabled = true;
  botaoEntrar.innerText = "Verificando...";

  if (document.getElementById("lembrar").checked) {
    localStorage.setItem("retintaEmail", email);
  } else {
    localStorage.removeItem("retintaEmail");
  }

  try {
    let resposta = await fetch(API_URL + "?email=" + encodeURIComponent(email));

    if (!resposta.ok) {
      throw new Error("Erro ao consultar os usuários.");
    }

    let usuarios = await resposta.json();
    let usuarioEncontrado = null;

    for (let i = 0; i < usuarios.length; i++) {
      if (
        usuarios[i].email.toLowerCase() === email &&
        usuarios[i].senha === senha &&
        usuarios[i].perfil === perfil
      ) {
        usuarioEncontrado = usuarios[i];
        break;
      }
    }

    if (usuarioEncontrado) {
      mostrarMensagem("Login realizado! Bem-vindo(a), " + usuarioEncontrado.nome + ".", "sucesso");

      // Guarda apenas dados básicos para simular uma sessão.
      sessionStorage.setItem("retintaUsuario", JSON.stringify({
        id: usuarioEncontrado.id,
        nome: usuarioEncontrado.nome,
        email: usuarioEncontrado.email,
        perfil: usuarioEncontrado.perfil
      }));

      setTimeout(function () {
        alert("Autenticação concluída para o perfil: " + nomePerfil(perfil) + ".");
      }, 100);
    } else {
      mostrarMensagem("E-mail, senha ou tipo de acesso incorretos.", "erro");
    }
  } catch (erro) {
    mostrarMensagem("Não foi possível conectar ao JSON Server. Confira se ele está rodando na porta 3000.", "erro");
    console.error(erro);
  }

  botaoEntrar.disabled = false;
  botaoEntrar.innerText = "Entrar";
});

function nomePerfil(perfil) {
  if (perfil === "consumidor") {
    return "Consumidor";
  } else if (perfil === "pintor") {
    return "Pintor parceiro";
  }
  return "Lojista / Administrador";
}

document.getElementById("esqueciSenha").addEventListener("click", function () {
  alert("A recuperação de senha será implementada em uma próxima etapa do projeto.");
});

document.getElementById("criarConta").addEventListener("click", function () {
  alert("A tela de cadastro será implementada em uma próxima etapa do projeto.");
});
