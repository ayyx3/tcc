// ----- IMPORTS MODULAR -----
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-app.js";
import { getDatabase, ref, onChildAdded } from "https://www.gstatic.com/firebasejs/11.8.0/firebase-database.js";

// ----- Configuração Firebase (mesma config) -----
const firebaseConfig = {
    apiKey: "AIzaSyB5lw6roQDGx43Fd1_uIxZjVyHtnVonZ2Y",
    authDomain: "biblioteca-73fcc.firebaseapp.com",
    projectId: "biblioteca-73fcc",
    storageBucket: "biblioteca-73fcc.appspot.com",
    messagingSenderId: "1015670120228",
    appId: "1:1015670120228:web:d6d1d827871e63881f1db1"
};

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);

// ----- ELEMENTOS -----
const listaLivrosEl = document.getElementById("listaLivros");
const livrosBanco = [];

// ----- FUNÇÃO CRIAR CARD -----
function criarCardLivro(titulo, autor, imagem) {
    const card = document.createElement("div");
    card.className = "card";

    const img = document.createElement("img");
    img.alt = "Capa do livro";
    const placeholder = "https://via.placeholder.com/100x150?text=Sem+Imagem";
    img.src = (imagem && imagem.startsWith("http")) ? imagem : placeholder;

    const tituloEl = document.createElement("p");
    tituloEl.className = "titulo";
    tituloEl.textContent = titulo;

    const autorEl = document.createElement("p");
    autorEl.className = "autor";
    autorEl.textContent = autor;

    const btnDetalhes = document.createElement("button");
    btnDetalhes.className = "btn-detalhes";
    btnDetalhes.textContent = "Detalhes";
    btnDetalhes.onclick = () => alert(`Título: ${titulo}\nAutor: ${autor}`);

    card.appendChild(img);
    card.appendChild(tituloEl);
    card.appendChild(autorEl);
    card.appendChild(btnDetalhes);

    listaLivrosEl.appendChild(card);
}

// ----- ATUALIZAR LISTA -----
function atualizarListaLivros() {
    listaLivrosEl.innerHTML = "";
    livrosBanco.forEach(livro => criarCardLivro(livro.titulo, livro.autor, livro.imagem || ""));
}

// ----- PESQUISA -----
document.getElementById("btnPesquisar").addEventListener("click", function () {
    const termoBusca = document.getElementById("pesquisa").value.toLowerCase().trim();
    listaLivrosEl.innerHTML = "";

    const resultados = livrosBanco.filter(livro =>
        livro.titulo.toLowerCase().includes(termoBusca) ||
        livro.autor.toLowerCase().includes(termoBusca)
    );

    if (resultados.length === 0) {
        listaLivrosEl.innerHTML = "<p style='text-align:center;'>Nenhum livro encontrado.</p>";
    } else {
        resultados.forEach(livro => criarCardLivro(livro.titulo, livro.autor, livro.imagem || ""));
    }
});

// ----- LISTENERS DO FIREBASE -----
onChildAdded(ref(database, "livros"), (snapshot) => {
    const livro = snapshot.val();
    livro.id = snapshot.key;
    livrosBanco.push(livro);
    atualizarListaLivros();
});
