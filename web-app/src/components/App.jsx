import React, { useEffect, useState } from "react";
import Header from "./Header";
import Faucet from "./Faucet";
import Balance from "./Balance";
import Transfer from "./Transfer";
import Web3 from "web3";
import { INF_CONTRACT_ADDRESS, LOCAL_NETWORK } from "../config/constants";
import InflaToken from "../artifacts/InflaToken.json";

function App() {

  const [web3Client, setWeb3Client] = useState();
  const [infContract, setInfContract] = useState();

  useEffect( () => {
    async function init() {
      // Initialize Web3 client
      const web3 = new Web3(Web3.givenProvider || LOCAL_NETWORK); // Metamask or Ganache
      setWeb3Client(web3);
      // Get accounts array
      const accounts = await web3.eth.getAccounts();
      console.log(accounts);
      // Initialize InflaToken contract
      const contract = new web3.eth.Contract(InflaToken.abi, INF_CONTRACT_ADDRESS); // Contract address
      setInfContract(contract);
      // Testing interaction with the contract
      const result = await contract.methods.getSomeText().call();
      console.log(result);
    }
    init();
  }, []);

  return (
    <div id="screen">
      <Header />
      {web3Client && infContract ? (
            <>
                <Faucet contract={infContract} web3={web3Client} />
                <Balance contract={infContract} />
            </>
        ) : (
          // Show a loading indicator while waiting for the state to be set
          <div className="lds-ellipsis center-loader">
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </div>
        )}
      <Transfer />
    </div>
  );
}

export default App;
