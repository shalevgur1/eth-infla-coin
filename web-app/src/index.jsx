import ReactDOM from 'react-dom';
import React from 'react';
import './styles/main.css';
import App from "./components/App";

const init = async () => { 
  ReactDOM.render(<App />, document.getElementById("root"));
}

init();


