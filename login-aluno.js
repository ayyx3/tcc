// ----- Configuração Firebase (compat) -----
const firebaseConfig = {
    apiKey: "AIzaSyB5lw6roQDGx43Fd1_uIxZjVyHtnVonZ2Y",
    authDomain: "biblioteca-73fcc.firebaseapp.com",
    projectId: "biblioteca-73fcc",
    storageBucket: "biblioteca-73fcc.appspot.com",
    messagingSenderId: "1015670120228",
    appId: "1:1015670120228:web:d6d1d827871e63881f1db1"
};

// Inicializa Firebase compat
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

// ----- FUNÇÕES DE TELA -----
function mostrarTela(id) {
    document.querySelectorAll(".tela").forEach(t => t.classList.remove("ativa"));
    document.getElementById(id).classList.add("ativa");
}

// ----- LOGIN -----
function loginAluno() {
    const nome = document.getElementById("nome").value.trim();
    const matricula = document.getElementById("matricula").value.trim();
    const msg = document.getElementById("msg");

    if (!nome || !matricula) {
        msg.textContent = "Preencha todos os campos.";
        msg.className = "msg error";
        return;
    }

    db.collection("Alunos")
        .where("nome", "==", nome) 
        .where("matricula", "==", matricula)
        .get()
        .then((querySnapshot) => {
            if (querySnapshot.empty) {
                msg.textContent = "Nome ou matrícula inválidos.";
                msg.className = "msg error";
            } else {
                msg.textContent = "Login efetuado! Redirecionando...";
                msg.className = "msg success";
                setTimeout(() => {
                    mostrarTela("telaLivros");
                }, 800);
            }
        })
        .catch((error) => {
            msg.textContent = "Erro: " + error.message;
            msg.className = "msg error";
        });
}

// ----- LOGOUT -----
function logout() {
    mostrarTela("telaLogin");
}
