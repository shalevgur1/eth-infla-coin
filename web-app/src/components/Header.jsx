import React from "react";
import inflationImg from "../assets/inflation.png";

function Header() {
  return (
    <header>
      <div className="blue window" id="logo">
        <h1 className="small-heading">
          <span role="img" aria-label="tap emoji">
          🏦
          </span>
          Welcome to InflaCoin
          <span role="img" aria-label="tap emoji">
          🏦
          </span>
        </h1>
      </div>
    </header>
  );
}

export default Header;
