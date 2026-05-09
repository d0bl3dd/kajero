/* =========================
   KAJERO APP
========================= */

/* ===== LOGIN ===== */
function login() {
    let user = document.getElementById("user").value.trim();
    let pass = document.getElementById("pass").value.trim();

    if (!user || !pass) {
        alert("Completa todos los campos");
        return;
    }

    let found = users.find(
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

/* ===== REGISTRO ===== */
function register() {
    let user = document.getElementById("user").value.trim();
    let pass = document.getElementById("pass").value.trim();

    if (!user || !pass) {
        alert("Completa todos los campos");
        return;
    }

    let exists = users.find(u => u.name === user);

    if (exists) {
        alert("Ese usuario ya existe");
        return;
    }

    let newUser = {
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
}

/* ===== DEPÓSITO ===== */
function deposit() {
    let amount = Number(
        document.getElementById("depositAmount").value
    );

    if (isNaN(amount) || amount <= 0) {
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
}

/* ===== RETIRO ===== */
function withdraw() {
    let amount = Number(
        document.getElementById("withdrawAmount").value
    );

    if (isNaN(amount) || amount <= 0) {
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
}

/* ===== TRANSFERENCIA ===== */
function transfer() {
    let receiverName = document
        .getElementById("toUser")
        .value
        .trim();

    let amount = Number(
        document.getElementById("transferAmount").value
    );

    let receiver = users.find(
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

    if (isNaN(amount) || amount <= 0) {
        alert("Monto inválido");
        return;
    }

    if (amount > currentUser.balance) {
        alert("Saldo insuficiente");
        return;
    }

    currentUser.balance -= amount;
    receiver.balance += amount;

    let receiverIndex = users.findIndex(
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

    alert("Transferencia realizada");
}

/* ===== TRANSACCIONES ===== */
function addTransaction(type, amount, from, to) {
    let transaction = {
        id: Date.now(),
        type: type,
        amount: amount,
        from: from,
        to: to,
        date: new Date().toLocaleString()
    };

    transactions.push(transaction);

    localStorage.setItem(
        "transactions",
        JSON.stringify(transactions)
    );
}

/* ===== ACTUALIZAR USUARIO ===== */
function updateUser() {
    let index = users.findIndex(
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

/* ===== REFRESH UI ===== */
function refresh() {
    let balanceElement =
        document.getElementById("balance");

    if (balanceElement) {
        balanceElement.innerText =
            "$" + currentUser.balance.toLocaleString();
    }
}

/* ===== LOGOUT ===== */
function logout() {
    localStorage.removeItem("currentUser");

    window.location.href = "login.html";
}

/* ===== PROTEGER DASHBOARD ===== */
if (
    window.location.pathname.includes("dashboard")
) {
    if (!currentUser) {
        window.location.href = "login.html";
    }
}

/* ===== CARGA AUTOMÁTICA ===== */
window.onload = () => {
    if (currentUser) {
        refresh();
    }
};