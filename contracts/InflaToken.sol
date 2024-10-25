// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";


// LoanContract interface to perform loan operations
interface ILoanContract {
    function getInterestRate () external view returns(uint256);
    function borrow (address borrower, uint256 amount, uint256 duration) external returns (uint256 loanId, uint256 repayAmount, uint256 dueDate, string memory);
    function repay (uint256 loanId) external returns (string memory, uint256 amount);
}

contract InflaToken is ERC20Burnable {
    // Smart contract for InflaToken. Acts as a Central Bank 
    // and implements small amount of inflation (between 2%-3% a year).

    // Amount of zeros to represent real coin value
    uint256 internal constant TOKEN_MULTIPLIER = 1;
    // Initial supply of the coin
    uint256 public INITIAL_SUPPLY = 10000;
    // Block reward for the miner of the block for every transaction in cluded in the block
    uint256 public BLOCK_REWARD = 1;

    // centralBank address - the creator of the contract
    address payable internal centralBank;

    // Declaration of LoanContract interface
    ILoanContract internal loanContract;

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

    function setBlockReward (uint256 reward) public onlyCentralBank {
        // Change the block reward for a given value. Can change only by the centralBank
        BLOCK_REWARD = reward * TOKEN_MULTIPLIER;
    }

    function setLoanContractAddress (address _loanContractAddress) public onlyCentralBank {
        // Set the loanContract Address in the loanContract interface
        loanContract = ILoanContract(_loanContractAddress);
    }

    function getMinerAddr () public view onlyCentralBank returns (address) {
        // Returns the miner address
        return block.coinbase;
    }

    function getInterestRate () public view returns (uint256) {
        // Returning interest rate value
        return loanContract.getInterestRate();
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
        // This function is being called on behalf of a third party and require that the 
        // token holder will give the necessary approving (approving need to be implemented according
        // to ERC20 standard).
        if (sender != address(0) && recipient != address(0)) return super.transferFrom(sender, recipient, amount);
        return false;
    }

    function transferTo(string memory actionType, address sender, address recipient, uint256 amount) public returns (string memory) {
        // Allows direct transfer of tokens from the specified sender to the recipient
        // This function is designed for development purposes to bypass the need for 
        // third-party approval, enabling immediate transfers.
        string memory message;
        uint256 senderBalance = balanceOf(sender);
        if (recipient == address(0)) {
            message = "No such address as given address";
            emit TransferResult(actionType, message);
            return message;
        }
        if (senderBalance < amount) {
            message = "No sufficient funds to preform the transfer";
            emit TransferResult(actionType, message);
            return message;
        }
        _transfer(sender, recipient, amount);
        message = "Funds have been transfered successfully";
        emit TransferResult(actionType, message);
        return message;
    }

    function faucet(address account, uint256 amount) public returns (string memory) {
        // Faucet specified amount of tokens to the given account address
        if (account == centralBank) {
            emit TransferResult("faucet", "Can not transfer funds to this account");
            return "Can not transfer funds to this account";
        }
        else return transferTo("faucet", centralBank, account, amount);
    }

    function getLoan (address borrower, uint256 amount, uint256 duration) public returns (uint256 loanId, uint256 repayAmount, uint256 dueDate, string memory) {
        // Borrow from Central Bank with current interest rate.
        // Uses LoanContract implementation.
        (uint256 resLoanId, uint256 resRepayAmount, uint256 resDueDate, string memory resMessage) = loanContract.borrow(borrower, amount, duration);
        emit BorrowResult(resLoanId, resRepayAmount, resDueDate, resMessage);
        return (resLoanId, resRepayAmount, resDueDate, resMessage);
    }

    function repayLoan (uint256 loanId) public returns (string memory, uint256 amount) {
        // Repay an existing loan
        (string memory resMessage, uint256 repayAmount) = loanContract.repay(loanId);
        emit RepayResult(resMessage, repayAmount);
        return (resMessage, repayAmount);
    }

    function getSomeText() public pure returns (string memory) {
        // Function for testing interaction with the deployed contract
        return "Successful interaction with contract";
    }

    function destroy() public onlyCentralBank() {
        // Allow the option to destroy the token supply when it goes on to the blockchain.
        selfdestruct(centralBank);
    }

// -----------------------------------
// MODIFIERS
// -----------------------------------

    modifier onlyCentralBank {
        require(msg.sender == centralBank, "Only the centralBank can call this function.");
        _;
    }

// -----------------------------------
// EVENTS
// -----------------------------------

    event TransferResult(string actionType, string message);
    event BorrowResult(uint256 loanId, uint256 repayAmount, uint256 dueDate, string message);
    event RepayResult(string message, uint256 repayAmount);
    //event DebugInfo(bool result);
}