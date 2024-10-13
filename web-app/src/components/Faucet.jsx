import React, { useState } from "react";
import { FAUCET_AMOUNT } from "../config/constants";

function Faucet() {

  const [isDisabled, setDisabled] = useState(false);
  const [lableText, setLableText] = useState(`Get your free InflaToken tokens here! Claim ${FAUCET_AMOUNT.toString()} INF coins to your account.`);

  async function handleClick(event) {
    setDisabled(true);
    // setDisabled(false);
  }

  return (
    <div className="blue window">
      <h2>
        <span role="img" aria-label="tap emoji">
          🚰
        </span>
        Faucet
      </h2>
      <label>{lableText}</label>
      <p className="trade-buttons">
        <button 
        id="btn-payout"
        onClick={handleClick}
        disabled={isDisabled}>
          Gimme gimme
        </button>
      </p>
    </div>
  );
}

export default Faucet;
