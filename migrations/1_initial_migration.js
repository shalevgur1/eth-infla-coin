const InflaToken = artifacts.require("InflaToken");
 
const initialSupply = 0;
const blockReward = 0;

module.exports = function(deployer) {
    deployer.deploy(InflaToken, initialSupply, blockReward);
};
  