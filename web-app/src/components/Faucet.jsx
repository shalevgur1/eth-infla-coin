import React, { useState, useEffect} from "react";
import { FAUCET_AMOUNT } from "../config/constants";

function Faucet(props) {

  // React states
  const [isDisabled, setDisabled] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [tokenSymbol, setTokenSymbol] = useState("");
  const [resultLable, setResultLable] = useState("");

  // Contract event listners
  var faucetResEvent;

  useEffect( () => {
    async function getSymbol() {
      // Get token symbol
      const symbol = await props.contract.methods.symbol().call();
      setTokenSymbol(symbol.toString());
    }

    async function subscribeEvents() {
      // subscribe to events on smart contract to get output from
      // chaging state methods.
      faucetResEvent = props.contract.events.FaucetResult();
      faucetResEvent.on("data", (data) => {
        setResultLable(data.returnValues.message);
      });
      faucetResEvent.on("error", (error) => {
        console.log("faucet error:", error);
      });
    }

    // Call useEffect funcitons
    getSymbol();
    subscribeEvents();

    // Return cleanup function
    return async () => {
      await faucetResEvent.unsubscribe((error, success) => {
          if (error) {
              console.error("Error unsubscribing:", error);
          }
          if (success) {
              console.log("Successfully unsubscribed from FaucetResult");
          }
      });
  };

  }, [props.contract]);

  async function handleClick(event) {
    // Give specify account tokens

    // First validation and organization
    if (!inputValue) return;
    const accountAddress = inputValue;
    setInputValue("");
    if (!props.web3.utils.isAddress(accountAddress)) {
      setResultLable("Incorrect account address.");
      return;
    };

    setDisabled(true);

    // Perform Faucet
    try {
      await props.contract.methods
      .faucet(accountAddress, FAUCET_AMOUNT)
      .send({from: accountAddress});
    } catch (err) {
      console.error("Error calling faucet function:", err);
    }

    setDisabled(false);
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
