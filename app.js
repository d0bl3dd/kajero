function login() {
    const user = document.getElementById("user").value.trim();
    const pass = document.getElementById("pass").value.trim();

    if (!user || !pass) {
        alert("Completa todos los campos");
        return;
    }

    const found = users.find(
        u => u.name === user && u.password === pass
    );

    if (!found) {
        alert("Usuario o contraseña incorrectos");
        return;
    }

    currentUser = found;

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );

    window.location.href = "dashboard.html";
}

function register() {
    const user = document.getElementById("user").value.trim();
    const pass = document.getElementById("pass").value.trim();

    if (!user || !pass) {
        alert("Completa todos los campos");
        return;
    }

    if (pass.length < 4) {
        alert("La contraseña debe tener mínimo 4 caracteres");
        return;
    }

    const exists = users.find(u => u.name === user);

    if (exists) {
        alert("Ese usuario ya existe");
        return;
    }

    const newUser = {
        id: Date.now(),
        name: user,
        password: pass,
        balance: 0
    };

    users.push(newUser);

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    alert("Usuario registrado correctamente");

    document.getElementById("user").value = "";
    document.getElementById("pass").value = "";
}

function deposit() {
    const amount = Number(
        document.getElementById("depositAmount").value
    );

    if (!amount || amount <= 0) {
        alert("Monto inválido");
        return;
    }

    currentUser.balance += amount;

    addTransaction(
        "Depósito",
        amount,
        currentUser.name,
        currentUser.name
    );

    updateUser();
    refresh();

    document.getElementById("depositAmount").value = "";

    showMessage("Depósito realizado correctamente");
}

function withdraw() {
    const amount = Number(
        document.getElementById("withdrawAmount").value
    );

    if (!amount || amount <= 0) {
        alert("Monto inválido");
        return;
    }

    if (amount > currentUser.balance) {
        alert("Saldo insuficiente");
        return;
    }

    currentUser.balance -= amount;

    addTransaction(
        "Retiro",
        amount,
        currentUser.name,
        currentUser.name
    );

    updateUser();
    refresh();

    document.getElementById("withdrawAmount").value = "";

    showMessage("Retiro realizado correctamente");
}

function transfer() {
    const receiverName = document
        .getElementById("toUser")
        .value
        .trim();

    const amount = Number(
        document.getElementById("transferAmount").value
    );

    if (!receiverName || !amount) {
        alert("Completa todos los campos");
        return;
    }

    const receiver = users.find(
        u => u.name === receiverName
    );

    if (!receiver) {
        alert("Usuario no encontrado");
        return;
    }

    if (receiver.name === currentUser.name) {
        alert("No puedes transferirte a ti mismo");
        return;
    }

    if (amount <= 0) {
        alert("Monto inválido");
        return;
    }

    if (amount > currentUser.balance) {
        alert("Saldo insuficiente");
        return;
    }

    currentUser.balance -= amount;
    receiver.balance += amount;

    const receiverIndex = users.findIndex(
        u => u.id === receiver.id
    );

    users[receiverIndex] = receiver;

    addTransaction(
        "Transferencia",
        amount,
        currentUser.name,
        receiver.name
    );

    updateUser();

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    refresh();

    document.getElementById("toUser").value = "";
    document.getElementById("transferAmount").value = "";

    showMessage("Transferencia realizada");
}

function addTransaction(type, amount, from, to) {
    const transaction = {
        id: Date.now(),
        type,
        amount,
        from,
        to,
        date: new Date().toLocaleString()
    };

    transactions.unshift(transaction);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

function updateUser() {
    const index = users.findIndex(
        u => u.id === currentUser.id
    );

    if (index !== -1) {
        users[index] = currentUser;
    }

    localStorage.setItem(
        "users",
        JSON.stringify(users)
    );

    localStorage.setItem(
        "currentUser",
        JSON.stringify(currentUser)
    );
}

function refresh() {
    const balanceElement =
        document.getElementById("balance");

    if (balanceElement) {
        balanceElement.innerText =
            "$ " + currentUser.balance.toLocaleString();
    }
}

function logout() {
    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}

function showMessage(text) {
    const old = document.querySelector(".toast");

    if (old) {
        old.remove();
    }

    const toast = document.createElement("div");

    toast.className = "toast";
    toast.innerText = text;

    document.body.appendChild(toast);

    setTimeout(() => {
        toast.classList.add("show");
    }, 100);

    setTimeout(() => {
        toast.classList.remove("show");

        setTimeout(() => {
            toast.remove();
        }, 300);
    }, 2500);
}

if (
    window.location.pathname.includes("dashboard")
) {
    if (!currentUser) {
        window.location.href = "login.html";
    }
}

window.onload = () => {
    if (currentUser) {
        refresh();
    }
};

document.addEventListener("keydown", e => {
    if (e.key === "Enter") {

        if (document.getElementById("user")) {
            login();
        }
    }
});