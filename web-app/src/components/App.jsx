import React, { useEffect } from "react";
import Header from "./Header";
import Faucet from "./Faucet";
import Balance from "./Balance";
import Transfer from "./Transfer";
import Web3 from "web3";
import { INF_CONTRACT_ADDRESS, LOCAL_NETWORK, CONTRACTS_PATH } from "../config/constants";
import InflaToken from "../artifacts/InflaToken.json";

function App() {

  useEffect( () => {
    async function init() {
      // Initialize Web3 - init interaction with contract
      const web3Client = new Web3(Web3.givenProvider || LOCAL_NETWORK); // Metamask or Ganache
      const accounts = await web3Client.eth.getAccounts();
      console.log(accounts);
      const infContract = new web3Client.eth.Contract(InflaToken.abi, INF_CONTRACT_ADDRESS); // Contract address
      const resultText = await infContract.methods.getSomeText().call();
      console.log(resultText);
    }
    init();
  }, []);

  return (
    <div id="screen">
      <Header />
      <Faucet />
      <Balance />
      <Transfer />
    </div>
  );
}

export default App;
