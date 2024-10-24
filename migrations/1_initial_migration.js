const fs = require('fs');
const path = require('path');

// Path to frontend config json file
const configPath = path.join(__dirname, '../web-app/src/config/config.json');

const InflaToken = artifacts.require("InflaToken");
const LoanContract = artifacts.require("LoanContract");



const initialSupply = 0;
const blockReward = 0;

module.exports = async function(deployer) {
    // Deploy InflaToken
    await deployer.deploy(InflaToken, initialSupply, blockReward);
    const depInflaToken = await InflaToken.deployed();

    // Deploy LoanContract
    await deployer.deploy(LoanContract, depInflaToken.address);
    const depLoanContract = await LoanContract.deployed();

    // Set LoanContract address in InflaToken
    await depInflaToken.setLoanContractAddress(depLoanContract.address);

    // Set InflaToken contract address in constants.json to enable frontend interaction
    // Update the config.json with the new contract address
    const config = JSON.parse(fs.readFileSync(configPath, 'utf8'));
    config.INF_CONTRACT_ADDRESS = depInflaToken.address;
    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
};
  