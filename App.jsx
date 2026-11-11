
import { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [transactions, setTransactions] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("transactions")) || [];
    } catch {
      return [];
    }
  });

  const [title, setTitle] = useState("");
  const [amount, setAmount] = useState("");
  const [type, setType] = useState("income");
  const [category, setCategory] = useState("Salary");

  // Save transactions in Local Storage
  useEffect(() => {
    localStorage.setItem(
      "transactions",
      JSON.stringify(transactions)
    );
  }, [transactions]);

  // Calculate totals
  const income = transactions
    .filter((item) => item.type === "income")
    .reduce((total, item) => total + item.amount, 0);

  const expenses = transactions
    .filter((item) => item.type === "expense")
    .reduce((total, item) => total + item.amount, 0);

  const balance = income - expenses;

  // Add transaction
  const addTransaction = (e) => {
    e.preventDefault();

    if (!title.trim() || !amount || Number(amount) <= 0) {
      alert("Please enter valid details");
      return;
    }

    const newTransaction = {
      id: Date.now(),
      title: title.trim(),
      amount: Number(amount),
      type,
      category,
      date: new Date().toLocaleDateString()
    };

    setTransactions((previous) => [
      newTransaction,
      ...previous
    ]);

    setTitle("");
    setAmount("");
  };

  // Delete transaction
  const deleteTransaction = (id) => {
    setTransactions((previous) =>
      previous.filter((item) => item.id !== id)
    );
  };

  return (
    <div className="app">
      <div className="container">

        <header>
          <h1>💰 Budget Planner</h1>
          <p>Manage your money smartly</p>
        </header>

        {/* Summary Cards */}
        <div className="summary">

          <div className="card balance">
            <h3>Total Balance</h3>
            <h2>₹{balance.toFixed(2)}</h2>
          </div>

          <div className="card income">
            <h3>Total Income</h3>
            <h2>₹{income.toFixed(2)}</h2>
          </div>

          <div className="card expense">
            <h3>Total Expenses</h3>
            <h2>₹{expenses.toFixed(2)}</h2>
          </div>

        </div>

        {/* Add Transaction */}
        <div className="section">
          <h2>Add Transaction</h2>

          <form onSubmit={addTransaction}>

            <input
              type="text"
              placeholder="Enter description"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />

            <input
              type="number"
              placeholder="Enter amount (₹)"
              value={amount}
              min="0.01"
              step="0.01"
              onChange={(e) => setAmount(e.target.value)}
            />

            <select
              value={type}
              onChange={(e) => {
                setType(e.target.value);
                setCategory(
                  e.target.value === "income"
                    ? "Salary"
                    : "Food"
                );
              }}
            >
              <option value="income">Income</option>
              <option value="expense">Expense</option>
            </select>

            <select
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              {type === "income" ? (
                <>
                  <option value="Salary">Salary</option>
                  <option value="Business">Business</option>
                  <option value="Other Income">Other Income</option>
                </>
              ) : (
                <>
                  <option value="Food">Food</option>
                  <option value="Shopping">Shopping</option>
                  <option value="Travel">Travel</option>
                  <option value="Bills">Bills</option>
                  <option value="Education">Education</option>
                  <option value="Other Expense">Other Expense</option>
                </>
              )}
            </select>

            <button type="submit">
              + Add Transaction
            </button>

          </form>
        </div>

        {/* Transaction History */}
        <div className="section">
          <h2>Transaction History</h2>

          {transactions.length === 0 ? (
            <p className="empty">
              No transactions yet. Add your first transaction!
            </p>
          ) : (
            <div className="transaction-list">

              {transactions.map((item) => (
                <div className="transaction" key={item.id}>

                  <div>
                    <h3>{item.title}</h3>
                    <p>
                      {item.category} | {item.date}
                    </p>
                  </div>

                  <div className="transaction-right">
                    <strong className={item.type}>
                      {item.type === "income" ? "+" : "-"}
                      ₹{item.amount.toFixed(2)}
                    </strong>

                    <button
                      className="delete-btn"
                      onClick={() => deleteTransaction(item.id)}
                    >
                      Delete
                    </button>
                  </div>

                </div>
              ))}

            </div>
          )}
        </div>

      </div>
    </div>
  );
}

export default App;
