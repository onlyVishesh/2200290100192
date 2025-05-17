import { FaPlus, FaRupeeSign } from "react-icons/fa";
import { ImBin } from "react-icons/im";

import { useState } from "react";
import "./App.css";

function App() {
  const [items, setItems] = useState([
    { name: "Groceries", date: "Apr 25, 2025", amount: 85.75 },
    { name: "Electricity Bill", date: "Apr 20, 2025", amount: 120.5 },
    { name: "Movie Ticket", date: "Apr 15, 2025", amount: 32.0 },
  ]);

  const [name, setName] = useState("");
  const [amount, setAmount] = useState("");
  const [date, setDate] = useState("");

  const addExpense = () => {
    if (name === "" || date === "" || amount === "") {
      return;
    }

    setItems([
      ...items,
      {
        name: name,
        amount: amount,
        date: date,
      },
    ]);

    setDate("");
    setName("");
    setAmount("");
  };

  // let total = items.map(item => item.amount)

  return (
    <>
      <h1>Expense tracker</h1>
      <div className="container">
        <div className="card">
          <div className="title">
            <h2>Total Expenses</h2>
            <p>
              <FaRupeeSign /> 200
            </p>
          </div>
          <div className="div2">
            <h3>
              All Expenses <FaPlus />
            </h3>
            <ul>
              {items.map((item) => (
                <li key={item.name}>
                  <div>
                    <p>{item.name} </p>
                    <p>{item.date} </p>
                  </div>
                  <div className="test">
                    <div>
                      <FaRupeeSign /> {item.amount}
                    </div>

                    <ImBin />
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="form">
          <h2>Add New Expense</h2>
          <p>Enter the details of your expense</p>
          <div className="form-items">
            <div className="field">
              <label>Title</label>
              <input
                type="text"
                onChange={(e) => {
                  setName(e.target.value);
                  console.log(name);
                }}
                value={name}
                placeholder="What did you spend on ?"
              />
            </div>
            <div className="field">
              <label>Amount</label>
              <input
                type="number"
                onChange={(e) => {
                  setAmount(e.target.value);
                  console.log(amount);
                }}
                value={amount}
                placeholder="0.00"
              />
            </div>
            <div className="field">
              <label>Date</label>
              <input
                type="date"
                onChange={(e) => {
                  setDate(e.target.value);
                  console.log(date);
                }}
                value={date}
              />
            </div>
          </div>
          <button className="submit"
            onClick={() => {
              addExpense();
            }}
          >
            Add Expense
          </button>
        </div>
      </div>
    </>
  );
}

export default App;
