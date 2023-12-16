const balance = document.querySelector("#balance");
const money_plus = document.querySelector("#money-plus");
const money_minus = document.querySelector("#money-minus");
const list = document.querySelector("#list");
const form = document.querySelector("#form");
const text = document.querySelector("#text");
const amount = document.querySelector("#amount");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

// check if there are some transactions in storage
let transactions =
  localStorage.getItem("transaction") !== null ? localStorageTransactions : [];

// Add trasaction
const addTransaction = (e) => {
  e.preventDefault();

  if (text.value.trim() === "" && amount.value.trim() === "") {
    alert("Please fill text and amount");
  } else {
    const transaction = {
      id: generateID(),
      text: text.value,
      amount: +amount.value,
    };

    transactions.push(transaction);

    addTransactionDOM(transaction);

    updateValues();

    updateLocalStorage();

    text.value = "";
    amount.value = "";
  }
};

// ID Generator with crypto built in javascript API
const generateID = () => crypto.randomUUID();

// Add transactions to DOM list
const addTransactionDOM = (transaction) => {
  // get the sign
  const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");

  // add class based on value
  item.classList.add(transaction.amount < 0 ? "minus" : "plus");

  item.innerHTML = `
  ${transaction.text} <span>${sign}${Math.abs(
    transaction.amount
  )}</span><button class="delete-btn"><i class="bi bi-trash3"></i></button>`;

  //   get created btn and give event listener
  const deleteBtn = item.querySelector(".delete-btn");
  console.log(deleteBtn);
  deleteBtn.addEventListener("click", removeTransactions);
};

// Update balance, income and expense
const updateValues = () => {
  // get total sum of all items
  const amounts = transactions.map((transaction) => transaction.amount);
  const total = amounts.reduce((acc, item) => (acc += item), 0).toFixed(2);

  if (total > 0) {
    balance.style.color = "green";
  } else if (total < 0) {
    balance.style.color = "red";
  } else {
    balance.style.color = "";
  }

  const income = amounts
    // Get only positive numbers and get income
    .filter((item) => item > 0)
    .reduce((acc, item) => (acc += item), 0)
    .toFixed(2);

  const expense = (
    amounts.filter((item) => item < 0).reduce((acc, item) => (acc += item), 0) *
    -1
  ).toFixed(2);

  balance.innerText = `$${total}`;
  money_plus.innerText = `$${income}`;
  money_minus.innerText = `$${expense}`;
};

// remove transaction
const removeTransactions = (id) => {
  transactions = transactions.filter((transaction) => transaction.id !== id);
  updateLocalStorage();
  init();
};

const updateLocalStorage = () =>
  localStorage.setItem("transactions", JSON.stringify(transactions));

// init APP
const init = () => {
  list.innerHTML = "";

  transactions.forEach(addTransactionDOM);
  updateValues();
};

init();

form.addEventListener("submit", addTransaction);
