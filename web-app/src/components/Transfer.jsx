import React, { useState, useEffect } from "react";

function Transfer(props) {
  
  const [isDisabled, setDisabled] = useState(false);
  const [toAccountInput, setToAccountInput] = useState();
  const [amountInput, setAmountInput] = useState();
  const [resultLable, setResultLable] = useState("");

  var transferResEvent;

  useEffect( () => {
    async function subscribeEvents() {
      // subscribe to events on smart contract to get output from
      // chaging state methods.
      transferResEvent = props.contract.events.TransferResult();
      transferResEvent.on("data", (data) => {
        const {actionType, message} = data.returnValues;
        if (actionType === "transfer") setResultLable(message);
      });
      transferResEvent.on("error", (error) => {
        console.log("faucet error:", error);
      });
    }

    // Call useEffect funcitons
    subscribeEvents();

    // Return cleanup function
    return async () => {
      await transferResEvent.unsubscribe((error, success) => {
          if (error) {
              console.error("Error unsubscribing:", error);
          }
          if (success) {
              console.log("Successfully unsubscribed from transferResEvent");
          }
      });
    };

  }, [props.contract]);

  async function handleClick() {
    // Transfer specified amount of tokens to specified account
    console.log(toAccountInput);
    // First validation and organization
    if (!toAccountInput || !amountInput) return;
    console.log("hello");

    setDisabled(true);

    let currentAccount = props.currentAccount;
    let tranferToAddr = toAccountInput;
    let amount = amountInput;

    setAmountInput("");
    setToAccountInput("");

    if (!props.web3.utils.isAddress(tranferToAddr)) {
      setResultLable("Incorrect account address.");
      return;
    };

    // Perform transfer of funds
    await props.contract.methods
    .transferTo("transfer", currentAccount, tranferToAddr, amount)
    .send({from: currentAccount});

    setDisabled(false);
  }

  return (
    <div className="window white">
      <div className="transfer">
        <fieldset>
          <legend>To Account:</legend>
          <ul>
            <li>
              <input
                type="text"
                id="transfer-to-id"
                onChange={(e) => setToAccountInput(e.target.value)}
                value={toAccountInput}
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
            Transfer
          </button>
        </p>
        <p>
          {resultLable}
        </p>
      </div>
    </div>
  );
}

export default Transfer;
