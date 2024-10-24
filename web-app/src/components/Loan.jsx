import React, { useState, useEffect } from "react";

function Loan(props) {
  
  const [isDisabled, setDisabled] = useState(false);
  const [borrowerInput, setborrowerInput] = useState();
  const [amountInput, setAmountInput] = useState();
  const [resultLable, setResultLable] = useState("");

  var loanResEvent;

  useEffect( () => {
    async function subscribeEvents() {
      // subscribe to events on smart contract to get output from
      // chaging state methods.
      loanResEvent = props.contract.events.TransferResult();
      loanResEvent.on("data", (data) => {
        const {actionType, message} = data.returnValues;
        if (actionType === "loan") setResultLable(message);
      });
      loanResEvent.on("error", (error) => {
        console.log("loan error:", error);
      });
    }

    // Call useEffect funcitons
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
    // Transfer specified amount of tokens to specified account
    console.log(borrowerInput);
    // First validation and organization
    if (!borrowerInput || !amountInput) return;

    setDisabled(true);

    let tranferToAddr = borrowerInput;
    let amount = amountInput;

    setAmountInput("");
    setborrowerInput("");

    if (!props.web3.utils.isAddress(tranferToAddr)) {
      setResultLable("Incorrect account address.");
      return;
    };

    // Perform Loan taking
    await props.contract.methods;

    setDisabled(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>Borrower:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                onChange={(e) => setborrowerInput(e.target.value)}
                value={borrowerInput}
              />
            </li>
          </ul>
        </fieldset>
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
