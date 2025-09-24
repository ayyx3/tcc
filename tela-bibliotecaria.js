// Config Firebase (Realtime + Firestore)
const firebaseConfig = {
    apiKey: "AIzaSyB5lw6roQDGx43Fd1_uIxZjVyHtnVonZ2Y",
    authDomain: "biblioteca-73fcc.firebaseapp.com",
    databaseURL: "https://biblioteca-73fcc-default-rtdb.firebaseio.com",
    projectId: "biblioteca-73fcc",
    storageBucket: "biblioteca-73fcc.appspot.com",
    messagingSenderId: "1015670120228",
    appId: "1:1015670120228:web:d6d1d827871e63881f1db1"
};

// Inicializa Firebase
firebase.initializeApp(firebaseConfig);

const auth = firebase.auth();
const database = firebase.database(); // livros
const db = firebase.firestore();      // alunos e empréstimos

// ELEMENTOS
const listaLivros = document.getElementById('listaLivros');
const modalLivro = document.getElementById('modalLivro');
const inputTitulo = document.getElementById('tituloLivro');
const inputAutor = document.getElementById('autorLivro');
const inputCodigo = document.getElementById('codigoLivro');
const inputImagem = document.getElementById('imagemLivro');
const btnPesquisar = document.getElementById('btnPesquisar');
const inputPesquisa = document.getElementById('inputBuscaLivro');

const msgAluno = document.getElementById('msgAluno');
const mensagem = document.getElementById('mensagem');
const resultadosDiv = document.getElementById('resultadosBusca');

let editarKey = null;

// --- VERIFICA LOGIN ---
auth.onAuthStateChanged(user => {
    if (!user) {
        // Se não estiver logado, redireciona para login
        window.location.href = "login-bibliotecaria.html";
    } else {
        // Usuário logado, carregar lista de livros
        listarLivrosRealtime();
    }
});

// --- FUNÇÕES DE LIVROS ---
function listarLivrosRealtime() {
    listaLivros.innerHTML = 'Carregando...';
    database.ref('livros').once('value')
        .then(snapshot => {
            const livros = snapshot.val();
            if (!livros) {
                listaLivros.innerHTML = '<p>Nenhum livro encontrado.</p>';
                return;
            }

            const filtro = inputPesquisa.value.trim().toLowerCase();
            listaLivros.innerHTML = '';
            Object.keys(livros).forEach(key => {
                const livro = livros[key];
                const titulo = (livro.titulo || '').toLowerCase();
                const autor = (livro.autor || '').toLowerCase();

                if (!filtro || titulo.includes(filtro) || autor.includes(filtro)) {
                    const card = document.createElement('div');
                    card.className = 'livro-card';
                    card.innerHTML = `
            <img src="${livro.imagem || 'https://via.placeholder.com/150'}" alt="Capa do livro ${livro.titulo}" />
            <h4>${livro.titulo}</h4>
            <p><strong>Autor:</strong> ${livro.autor}</p>
            <p><strong>Código:</strong> ${livro.codigo}</p>
            <button onclick="editarLivro('${key}')">Editar</button>
            <button onclick="excluirLivro('${key}')">Excluir</button>
          `;
                    listaLivros.appendChild(card);
                }
            });
        })
        .catch(error => {
            console.error('Erro ao carregar livros:', error);
            listaLivros.innerHTML = '<p>Erro ao carregar livros.</p>';
        });
}

btnPesquisar.addEventListener('click', listarLivrosRealtime);

window.abrirModal = function () {
    editarKey = null;
    inputTitulo.value = '';
    inputAutor.value = '';
    inputCodigo.value = '';
    inputImagem.value = '';
    modalLivro.style.display = 'flex';
};

window.fecharModal = function () {
    modalLivro.style.display = 'none';
};

window.adicionarLivro = function () {
    const titulo = inputTitulo.value.trim();
    const autor = inputAutor.value.trim();
    const codigo = inputCodigo.value.trim();
    const imagem = inputImagem.value.trim();

    if (!titulo || !autor || !codigo) {
        alert('Preencha todos os campos obrigatórios.');
        return;
    }

    const livro = { titulo, autor, codigo, imagem };

    if (editarKey) {
        database.ref('livros/' + editarKey).set(livro)
            .then(() => {
                alert('Livro atualizado!');
                fecharModal();
                listarLivrosRealtime();
            })
            .catch(console.error);
    } else {
        const novoRef = database.ref('livros').push();
        novoRef.set(livro)
            .then(() => {
                alert('Livro adicionado!');
                fecharModal();
                listarLivrosRealtime();
            })
            .catch(console.error);
    }
};

window.editarLivro = function (key) {
    database.ref('livros/' + key).once('value')
        .then(snapshot => {
            const livro = snapshot.val();
            if (!livro) return alert('Livro não encontrado.');
            editarKey = key;
            inputTitulo.value = livro.titulo;
            inputAutor.value = livro.autor;
            inputCodigo.value = livro.codigo;
            inputImagem.value = livro.imagem || '';
            modalLivro.style.display = 'flex';
        })
        .catch(console.error);
};

window.excluirLivro = function (key) {
    if (confirm('Tem certeza que deseja excluir este livro?')) {
        database.ref('livros/' + key).remove()
            .then(() => {
                alert('Livro excluído!');
                listarLivrosRealtime();
            })
            .catch(console.error);
    }
};

// --- FUNÇÕES DE ALUNOS ---
async function cadastrarAluno() {
    const nome = document.getElementById('nomeAluno').value.trim();
    const matricula = document.getElementById('matriculaAluno').value.trim();

    if (!nome || !matricula) {
        msgAluno.textContent = "Preencha todos os campos.";
        msgAluno.className = "msg error";
        return;
    }

    try {
        const query = await db.collection('Alunos').where('matricula', '==', matricula).get();
        if (!query.empty) {
            msgAluno.textContent = "Matrícula já cadastrada.";
            msgAluno.className = "msg error";
            return;
        }

        await db.collection('Alunos').add({
            nome: nome.toLowerCase(),
            matricula: matricula
        });

        msgAluno.textContent = "Aluno cadastrado com sucesso!";
        msgAluno.className = "msg success";
        document.getElementById('nomeAluno').value = '';
        document.getElementById('matriculaAluno').value = '';

    } catch (error) {
        msgAluno.textContent = "Erro ao cadastrar: " + error.message;
        msgAluno.className = "msg error";
    }
}

// --- FUNÇÕES DE EMPRÉSTIMOS ---
async function registrarEmprestimo() {
    const nome = document.getElementById('nomeEmp').value.trim();
    const matricula = document.getElementById('matriculaEmp').value.trim();
    const codigo = document.getElementById('codigoEmp').value.trim();

    if (!nome || !matricula || !codigo) {
        mensagem.textContent = "⚠️ Preencha todos os campos do empréstimo.";
        mensagem.className = "msg error";
        return;
    }

    try {
        await db.collection('emprestimos').add({
            nome,
            matricula,
            codigo,
            data_emprestimo: new Date().toISOString(),
            data_devolucao: null
        });

        mensagem.textContent = "✅ Empréstimo registrado com sucesso!";
        mensagem.className = "msg success";

        document.getElementById('nomeEmp').value = '';
        document.getElementById('matriculaEmp').value = '';
        document.getElementById('codigoEmp').value = '';

    } catch (error) {
        mensagem.textContent = "❌ Erro ao registrar empréstimo: " + error.message;
        mensagem.className = "msg error";
    }
}

async function registrarDevolucao() {
    const matricula = document.getElementById('matriculaDev').value.trim();
    const codigo = document.getElementById('codigoDev').value.trim();

    if (!matricula || !codigo) {
        mensagem.textContent = "⚠️ Preencha todos os campos da devolução.";
        mensagem.className = "msg error";
        return;
    }

    try {
        const query = await db.collection('emprestimos')
            .where('matricula', '==', matricula)
            .where('codigo', '==', codigo)
            .where('data_devolucao', '==', null)
            .limit(1)
            .get();

        if (query.empty) {
            mensagem.textContent = "❌ Nenhum empréstimo pendente encontrado para essa matrícula e código.";
            mensagem.className = "msg error";
            return;
        }

        const docRef = query.docs[0].ref;
        await docRef.update({ data_devolucao: new Date().toISOString() });

        mensagem.textContent = "✅ Devolução registrada com sucesso!";
        mensagem.className = "msg success";

        document.getElementById('matriculaDev').value = '';
        document.getElementById('codigoDev').value = '';

    } catch (error) {
        mensagem.textContent = "❌ Erro ao registrar devolução: " + error.message;
        mensagem.className = "msg error";
    }
}

async function buscarEmprestimos() {
    const matricula = document.getElementById('matriculaBusca').value.trim();
    const filtro = document.getElementById('filtroDevolucao').value;
    resultadosDiv.innerHTML = '';

    try {
        let query = db.collection('emprestimos');

        if (matricula) query = query.where('matricula', '==', matricula);

        const snapshot = await query.get();
        const docs = snapshot.docs.filter(doc => {
            const d = doc.data();
            if (filtro === 'pendentes') return d.data_devolucao === null;
            if (filtro === 'devolvidos') return d.data_devolucao !== null;
            return true; // todos
        });

        if (docs.length === 0) {
            resultadosDiv.innerHTML = '<p>🔍 Nenhum resultado encontrado.</p>';
            return;
        }

        docs.forEach(doc => {
            const d = doc.data();
            const dataEmp = new Date(d.data_emprestimo).toLocaleString();
            const dataDev = d.data_devolucao ? new Date(d.data_devolucao).toLocaleString() : '⏳ Pendente';
            const p = document.createElement('p');
            p.textContent = `📘 ${d.nome} | Matrícula: ${d.matricula} | Livro: ${d.codigo} | Empréstimo: ${dataEmp} | Devolução: ${dataDev}`;
            resultadosDiv.appendChild(p);
        });

    } catch (error) {
        mensagem.textContent = "❌ Erro na busca: " + error.message;
        mensagem.className = "msg error";
    }
}
