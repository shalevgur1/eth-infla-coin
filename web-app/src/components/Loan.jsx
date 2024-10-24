import React, { useState, useEffect } from "react";

// Function to convert timestamp to HH:MIN:SEC
function formatTimestampToTime(timestamp) {
  console.log(timestamp);
  const date = new Date(timestamp * 1000); // Convert timestamp (in seconds) to milliseconds
  const hours = date.getUTCHours().toString().padStart(2, '0');
  const minutes = date.getUTCMinutes().toString().padStart(2, '0');
  const seconds = date.getUTCSeconds().toString().padStart(2, '0');

  return `${hours}:${minutes}:${seconds}`;
}

function Loan(props) {
  
  const [isDisabled, setDisabled] = useState(false);
  const [amountInput, setAmountInput] = useState();
  const [durationInput, setDurationInput] = useState();
  const [resultLable, setResultLable] = useState("");
  const [interestRate, setInterestRate] = useState();

  var loanResEvent;

  useEffect( () => {
    async function getInterestRate() {
        // Get current Central Bank Interest Rate
        const IR = await props.contract.methods.getInterestRate().call();
        setInterestRate(IR.toString());
    }

    async function subscribeEvents() {
      // subscribe to events on smart contract to get output from
      // chaging state methods.
      loanResEvent = props.contract.events.BorrowResult();
      loanResEvent.on("data", (data) => {
        const {loanId, repayAmount, dueDate, message} = data.returnValues;
        if (loanId != 0) {
            let dueDateTime = formatTimestampToTime(dueDate);
            let fullMessage = `${message}. Loan id: ${loanId} | Repay amount: ${repayAmount} | Due date: ${dueDateTime}`;
            setResultLable(fullMessage);
        } else {
            setResultLable(message);
        }
      });
      loanResEvent.on("error", (error) => {
        console.log("loan error:", error);
      });
    }

    // Call useEffect funcitons
    getInterestRate();
    subscribeEvents();

    // Return cleanup function
    return async () => {
      await loanResEvent.unsubscribe((error, success) => {
          if (error) {
              console.error("Error unsubscribing:", error);
          }
          if (success) {
              console.log("Successfully unsubscribed from loanResEvent");
          }
      });
    };

  }, [props.contract]);

  async function handleClick() {
    // Borrow specified amount of tokens to specified account form the Central Bank
    // First validation and organization
    if (!amountInput || !durationInput) return;

    setDisabled(true);

    let borrower = props.currentAccount;
    let amount = amountInput;
    let duration = durationInput;

    console.log(borrower, amount, duration);

    setAmountInput("");
    setDurationInput("");

    if (!props.web3.utils.isAddress(borrower)) {
      setResultLable("Incorrect account address.");
      return;
    };

    // Perform Loan
    await props.contract.methods
    .borrow(borrower, amount, duration)
    .send({from: borrower});

    setDisabled(false);
  }

  return (
    <div className="window white">
    <label>The current Interest Rate for loans is {interestRate}% .</label>
    <div style={{ marginBottom: "20px" }}></div>
      <div className="transfer">
        <fieldset>
          <legend>Amount:</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                onChange={(e) => setAmountInput(e.target.value)}
                value={amountInput}
              />
            </li>
          </ul>
        </fieldset>
        <fieldset>
          <legend>Duration (sec):</legend>
          <ul>
            <li>
              <input
                type="number"
                id="amount"
                onChange={(e) => setDurationInput(e.target.value)}
                value={durationInput}
              />
            </li>
          </ul>
        </fieldset>
        <p className="trade-buttons">
          <button id="btn-transfer" onClick={handleClick} disabled={isDisabled} >
            Take Loan
          </button>
        </p>
        <p>
          {resultLable}
        </p>
      </div>
    </div>
  );
}

export default Loan;
