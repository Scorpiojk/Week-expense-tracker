const balance = document.querySelector("#balance");
const money_plus = document.querySelector("#money-plus");
const money_minus = document.querySelector("#money-minus");
const plusBtn = document.querySelector("#income");
const minusBtn = document.querySelector("#expense");
const list = document.querySelector("#list");
const form = document.querySelector("#form");
const text = document.querySelector("#text");
const amount = document.querySelector("#amount");
const dateText = document.querySelector("#date");

const localStorageTransactions = JSON.parse(
  localStorage.getItem("transactions")
);

// get date and change text
function getFirstLastDayOfWeek() {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday
  const day = today.getDate();
  const firstDayOfWeek = new Date(today);
  const lastDayOfWeek = new Date(today);

  // Adjust to get the first day of the week (Monday)
  firstDayOfWeek.setDate(day - dayOfWeek + (dayOfWeek === 0 ? -6 : 1));

  // Adjust to get the last day of the week (Sunday)
  lastDayOfWeek.setDate(firstDayOfWeek.getDate() + 6);

  return {
    firstDay: {
      day: firstDayOfWeek.getDate(),
      month: firstDayOfWeek.toLocaleString("en-us", { month: "short" }),
    },
    lastDay: {
      day: lastDayOfWeek.getDate(),
      month: lastDayOfWeek.toLocaleString("en-us", { month: "short" }),
    },
  };
}
// add to the html
const { firstDay, lastDay } = getFirstLastDayOfWeek();
console.log("First day of the week:", firstDay);
console.log("Last day of the week:", lastDay);
dateText.innerHTML = `From ${firstDay.day} of ${firstDay.month} to, ${lastDay.day} of ${lastDay.month}`;

/* ====================== */

// check if there are some transactions in storage
let transactions =
  localStorage.getItem("transactions") !== null ? localStorageTransactions : [];

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
    plusBtn.checked = false;
    minusBtn.checked = false;
  }
};

// ID Generator with crypto built in javascript API
const generateID = () => parseInt(Math.random() * 1000);

// Add transactions to DOM list
const addTransactionDOM = (transaction) => {
  // get the sign

  if (minusBtn.checked === true) {
    transaction.amount = -transaction.amount;
  }

  // const sign = transaction.amount < 0 ? "-" : "+";

  const item = document.createElement("li");

  // bootsrap classes
  item.classList.add(
    "bg-black",
    "bg-opacity-10",
    "border-3",
    "border-start",
    "p-2",
    "list-group-item",
    "d-flex",
    "flex-row",
    "justify-content-evenly",
    "align-items-center"
  );
  // add class based on value
  item.classList.add(
    transaction.amount < 0 ? "border-danger" : "border-success"
  );

  item.innerHTML = `
  <div class="flex-fill p-2">
    ${transaction.text} <span>${Math.abs(transaction.amount)}</span>
  </div>
  <button class="btn btn-outline-danger" onclick=removeTransactions(${
    transaction.id
  })><i class="bi bi-trash3" fill="currentColor"></i></button>`;

  list.appendChild(item);

  item.dataset.transactionId = transaction.id;
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
  console.log(id);
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
