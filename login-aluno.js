    // Configurar Firebase
    const firebaseConfig = {
    apiKey: "AIzaSyB5lw6roQDGx43Fd1_uIxZjVyHtnVonZ2Y",
    authDomain: "biblioteca-73fcc.firebaseapp.com",
    projectId: "biblioteca-73fcc",
    storageBucket: "biblioteca-73fcc.appspot.com",
    messagingSenderId: "1015670120228",
    appId: "1:1015670120228:web:d6d1d827871e63881f1db1"
    };

    firebase.initializeApp(firebaseConfig);
    const db = firebase.firestore();

    function loginAluno() {
    const nome = document.getElementById("nome").value.trim().toLowerCase();
    const matricula = document.getElementById("matricula").value.trim();
    const msg = document.getElementById("msg");

    if (!nome || !matricula) {
        msg.textContent = "Preencha todos os campos.";
        msg.className = "msg error";
        return;
    }

    db.collection("Alunos")
        .where("matricula", "==", matricula)
        .where("nome", "==", nome)
        .get()
        .then((querySnapshot) => {
        if (querySnapshot.empty) {
            msg.textContent = "Nome ou matrícula inválidos.";
            msg.className = "msg error";
        } else {
            msg.textContent = "Login efetuado! Redirecionando...";
            msg.className = "msg success";
            setTimeout(() => {
            window.location.href = "Tela-alunos.html";
            }, 1200);
        }
        })
        .catch((error) => {
        msg.textContent = "Erro: " + error.message;
        msg.className = "msg error";
        });
    }
