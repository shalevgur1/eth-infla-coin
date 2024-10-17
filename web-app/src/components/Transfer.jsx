import React, { useState } from "react";

function Transfer(props) {
  
  const [isDisabled, setDisabled] = useState(false);
  const [toAccountInput, setToAccountInput] = useState();
  const [amountInput, setAmountInput] = useState();
  const [resultLable, setResultLable] = useState("");

  async function handleClick() {
    // Transfer specified amount of tokens to specified account
    if (!toAccountInput || !amountInput) return;
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
    const transferResult = await props.contract.methods
    .transferTo(currentAccount, tranferToAddr, amount)
    .send({from: currentAccount});
    console.log(transferResult);
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
