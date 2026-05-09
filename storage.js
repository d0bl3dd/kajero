const users = JSON.parse(
    localStorage.getItem("users")
) || [];

let currentUser = JSON.parse(
    localStorage.getItem("currentUser")
) || null;

const transactions = JSON.parse(
    localStorage.getItem("transactions")
) || [];