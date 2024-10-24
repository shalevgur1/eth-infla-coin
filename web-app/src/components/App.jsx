import React, { useEffect, useState } from "react";
import Header from "./Header";
import Faucet from "./Faucet";
import Balance from "./Balance";
import Transfer from "./Transfer";
import Loan from "./Loan";
import Web3 from "web3";
import { INF_CONTRACT_ADDRESS, LOCAL_NETWORK } from "../config/constants";
import InflaToken from "../artifacts/InflaToken.json";

function App() {

  const accountsAddr = [];

  const [web3Client, setWeb3Client] = useState();
  const [infContract, setInfContract] = useState();

  // For development purposes (replacing MetaMask).
  const [currentAccount, setCurrentAccount] = useState(); 

  useEffect( () => {
    async function init() {
      // Initialize Web3 client
      const web3 = new Web3(Web3.givenProvider || new Web3.providers.WebsocketProvider(LOCAL_NETWORK)); // Metamask or Ganache
      setWeb3Client(web3);
      // Get accounts array
      const accountsAddr = await web3.eth.getAccounts();
      setCurrentAccount(accountsAddr[1]);
      console.log(`Current account address: ${currentAccount}`);

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
      {web3Client && infContract && currentAccount ? (
            <>
                <Faucet 
                contract={infContract} 
                web3={web3Client} />
                <Balance 
                contract={infContract} />
                <Transfer 
                currentAccount={currentAccount} 
                contract={infContract}
                web3={web3Client}/>
                <Loan 
                contract={infContract}
                web3={web3Client}
                />
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
    </div>
  );
}

export default App;
