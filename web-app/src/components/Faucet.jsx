import React, { useState, useEffect} from "react";
import { FAUCET_AMOUNT } from "../config/constants";

function Faucet(props) {

  const [isDisabled, setDisabled] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [resultLable, setResultLable] = useState("");

  useEffect( () => {
    async function getSymbol() {
      // Get token symbol
      const symbol = await props.contract.methods.symbol().call();
      setTokenSymbol(symbol.toString());
    }
    getSymbol();
  }, []);

  async function handleClick(event) {
    // Give specify account tokens
    if (!inputValue) return;
    const accountAddress = inputValue;
    if (!props.web3.utils.isAddress(accountAddress)) {
      setResultLable("Incorrect account address.");
      return;
    };
    setDisabled(true);
    const faucetResult = await props.contract.methods.faucet(accountAddress, FAUCET_AMOUNT).send();
    console.log(faucetResult);
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
      <label>Get your free InflaToken tokens here! Claim {`${FAUCET_AMOUNT.toString()}`} {tokenSymbol} coins to your account.</label>
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
        id="btn-payout"
        onClick={handleClick}
        disabled={isDisabled}>
          Gimme gimme
        </button>
      </p>
      <p>
        {resultLable}
      </p>
    </div>
  );
}

export default Faucet;
