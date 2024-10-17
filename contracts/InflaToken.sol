// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract InflaToken is ERC20Burnable {
    // Smart contract for InflaToken. Acts as a Central Bank 
    // and implements small amount of inflation (between 2%-3% a year).

    // Amount of zeros to represent real coin value
    uint256 internal constant TOKEN_MULTIPLIER = 1;
    // Initial supply of the coin
    uint256 public INITIAL_SUPPLY = 10000;
    // Block reward for the miner of the block for every transaction in cluded in the block
    uint256 public BLOCK_REWARD = 1;

    address payable public centralBank;

    constructor (uint256 _initialSupply, uint256 _reward)
    ERC20("InflaToken", "INF") {
        // Set centralBank as the creator of the contract.
        centralBank = payable(msg.sender);
        // Set initial values if given. 0 value will set the default values.
        INITIAL_SUPPLY = _initialSupply > 0 ? _initialSupply : INITIAL_SUPPLY;
        BLOCK_REWARD = _reward > 0 ? _reward : BLOCK_REWARD;
        // Minting all initial supply to the centralBank.
        _mint(centralBank, INITIAL_SUPPLY * TOKEN_MULTIPLIER);
    }

    function setBlockReward (uint256 reward) public onlycentralBank {
        // Change the block reward for a given value. Can change only by the centralBank
        BLOCK_REWARD = reward * TOKEN_MULTIPLIER;
    }

    function getMinerAddr () public view onlycentralBank returns (address) {
        // Returns the miner address
        return block.coinbase;
    }

    function _minerReward() internal {
        // Transfer reward to miner from the central bank account
        transferFrom(centralBank, block.coinbase, BLOCK_REWARD);
    }

    function _beforeTokenTransfer(address from, address to, uint256 value) internal virtual override(ERC20) {
        // A "hook" function that is being invoked before transactions to reward the miner.
        if(from != address(0) && block.coinbase != address(0) && to != block.coinbase) {
            _minerReward();
        }
        super._beforeTokenTransfer(from, to, value);
    }

    function transfer(address to, uint256 value) public virtual override(ERC20) returns(bool) {
        // Transfer from the caller for this function
        if (to != address(0)) return super.transfer(to, value * TOKEN_MULTIPLIER);
        return false;
    }

    function transferFrom(address sender, address recipient, uint256 amount) public virtual override(ERC20) returns (bool) {
        // Transfer from a defiend sender to a defined recipient
        if (sender != address(0) && recipient != address(0)) return super.transferFrom(sender, recipient, amount);
        return false;
    }

    function faucet(address account, uint256 amount) public returns (string memory) {
        // Faucet specified amount of tokens to the given account address
        uint256 centralBankBalance = balanceOf(centralBank);
        if (account == address(0)) return "No such address as given address";
        if (centralBankBalance < amount) return "Central Bank does not have sufficient funds";
        if (account == centralBank) return "Can not transfer funds to this account";
        _transfer(centralBank, account, amount);
        return "Funds have been transfered successfully";
    }

    function getSomeText() public pure returns (string memory) {
        // Function for testing interaction with the deployed contract
        return "Successful interaction with contract";
    }

    function destroy() public onlycentralBank() {
        // Allow the option to destroy the token supply when it goes on to the blockchain.
        selfdestruct(centralBank);
    }

// -----------------------------------
// MODIFIERS
// -----------------------------------

    modifier onlycentralBank {
        require(msg.sender == centralBank, "Only the centralBank can call this function.");
        _;
    }

// -----------------------------------
// EVENTS
// -----------------------------------

    event DebugInfo(bool result, address miner);
}