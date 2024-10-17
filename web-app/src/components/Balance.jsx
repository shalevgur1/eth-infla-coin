import React, { useState } from "react";

function Balance(props) {
  
  const [inputValue, setInputValue] = useState("");
  const [balance, setBalance] = useState("");
  const [isHidden, setIsHidden] = useState(true);

  async function handleClick() {
    if (!inputValue) return;
    setIsHidden(false);
    setInputValue("");
    const accountAddress = inputValue;
    const balanceRes = await props.contract.methods.balanceOf(accountAddress).call();
    setBalance(balanceRes);
  }

  return (
    <div className="window white">
      <label>Check account token balance:</label>
      <p>
        <input
          id="balance-principal-id"
          type="text"
          placeholder="Enter a account address"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
      </p>
      <p className="trade-buttons">
        <button
          id="btn-request-balance"
          onClick={handleClick}
        >
          Check Balance
        </button>
      </p>
      <p hidden={isHidden}>This account has a balance of {balance.toString()}.</p>
    </div>
  );
}

export default Balance;
