    // Config Firebase
    const firebaseConfig = {
    apiKey: "AIzaSyB5lw6roQDGx43Fd1_uIxZjVyHtnVonZ2Y",
    authDomain: "biblioteca-73fcc.firebaseapp.com",
    projectId: "biblioteca-73fcc",
    storageBucket: "biblioteca-73fcc.appspot.com",
    messagingSenderId: "1015670120228",
    appId: "1:1015670120228:web:d6d1d827871e63881f1db1"
    };

    firebase.initializeApp(firebaseConfig);
    const auth = firebase.auth();

    function login() {
    const email = document.getElementById("email").value.trim();
    const senha = document.getElementById("senha").value;
    const msg = document.getElementById("msg");

    if (!email || !senha) {
        msg.textContent = "Preencha todos os campos.";
        msg.className = "msg error";
        return;
    }

    auth.signInWithEmailAndPassword(email, senha)
        .then(() => {
        msg.textContent = "Login efetuado! Redirecionando...";
        msg.className = "msg success";
        setTimeout(() => {
            window.location.href = "Tela-bibliotecaria.html";
        }, 1500);
        })
        .catch(error => {
        msg.textContent = "Erro: " + error.message;
        msg.className = "msg error";
        });
    }
