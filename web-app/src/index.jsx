import ReactDOM from 'react-dom';
import React from 'react';
import './styles/main.css';
import App from "./components/App";

// -----------------------------------
// MODIFIERS
// -----------------------------------

const FAUCET_AMOUNT = 100;
export default FAUCET_AMOUNT;


// -----------------------------------
// APPLICATION ENTRY POINT
// -----------------------------------

const init = async () => { 
  ReactDOM.render(<App />, document.getElementById("root"));
}

init();


