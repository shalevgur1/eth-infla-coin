// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./InflaToken.sol";

contract LoanContract is Ownable {

    // Holds the inflaToken contract address.
    // Holds relevant methods and information,
    // and the central bank.
    InflaToken public inflaToken;

    // Should be the central bank address
    address payable public contractOwner;

    // Interest rate precentage (TODO: be multiplied by TOKEN_MULTIPLIER for adjusted decimal precision)
    uint256 internal INTEREST_RATE = 5;

    // Include all the Loan necessary info
    struct Loan {
        address borrower;
        uint256 amount;
        uint256 interest;
        uint256 dueDate;
        bool isRepaid;
    }

    // Create a key:value map of loans
    mapping(uint256 => Loan) public loans;
    // Counter and id tracker for the loan map
    uint256 public loanCounter;

    constructor (InflaToken _token) {
        // LoanContract initialized with InflaToken
        inflaToken = _token;
        contractOwner = payable(msg.sender);
    }

    function setInterestRate (uint256 precentage) public onlyOwner {
        // Enabling change of interest rate by the central bank.
        INTEREST_RATE = precentage;
    }

    function borrow(address borrower, uint256 amount, uint256 duration) public onlyOwner returns (uint256 loanId) {
        // Borrow InflaToken function, setting a due date
        require(inflaToken.balanceOf(contractOwner) >= amount, "Insufficient contract token balance");
        loanCounter++;
        uint256 dueDate = block.timestamp + duration;

        loans[loanCounter] = Loan({
            borrower: borrower,
            amount: amount,
            interest: INTEREST_RATE,
            dueDate: dueDate,
            isRepaid: false
        });

        // Transfer tokens from the contract to the borrower
        inflaToken.transferTo('borrow', contractOwner, borrower, amount);

        emit LoanBorrowed(borrower, loanCounter, amount, dueDate);

        // Return loan id
        return loanCounter;
    }

    // Repay function to repay borrowed tokens
    function repay(uint256 loanId) public onlyOwner {
        Loan storage loan = loans[loanId];
        require(loan.isRepaid == false, "Loan already repaid");
        require(block.timestamp >= loan.dueDate, "Loan is not overdue");

        // Calculate repay amount with interest
        uint256 repayAmount = loan.amount + ((loan.amount * INTEREST_RATE) / 100);

        // Transfer tokens back to the contract
        token.transferTo('repay', loan.borrower, contractOwner, repayAmount);
        loan.isRepaid = true;

        emit LoanRepaid(loan.borrower, loanId, repayAmount);
    }

    function isLoanOverdue(uint256 loanId) public view returns (bool) {
        // Check if loan is overdue
        Loan storage loan = loans[loanId];
        return block.timestamp > loan.dueDate && !loan.isRepaid;
    }

    function isLoanRepaid(uint256 loanId) public view returns (bool) {
        // Check if loan is repaid
        Loan storage loan = loans[loanId];
        return loan.isRepaid;
    }

// -----------------------------------
// EVENTS
// -----------------------------------

    event LoanBorrowed(address borrower, uint256 loanId, uint256 amount, uint256 dueDate);
    event LoanRepaid(address borrower, uint256 loanId, uint256 amount);
}
