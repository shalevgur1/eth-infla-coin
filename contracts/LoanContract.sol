// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

// import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "./InflaToken.sol";

// InflaToken interface to interact with the InflaToken contract
interface IInflaToken {
    function balanceOf(address account) external view returns (uint256);
    function transferTo(string memory actionType, address sender, address recipient, uint256 amount) external returns (string memory);
}

contract LoanContract is Ownable {

    // Holds the inflaToken contract interface.
    // Holds relevant methods and information,
    // and the central bank.
    IInflaToken public inflaToken;

    // InflaToken address as central bank
    address payable public inflaTokenAddress;

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
    // Counter and id tracker for the loan map. Loan Id 0 represents an error.
    uint256 public loanCounter = 1;

    constructor (address _inflaTokenAddress) {
        // LoanContract initialized with InflaToken
        inflaToken = IInflaToken(_inflaTokenAddress);
        inflaTokenAddress = payable(_inflaTokenAddress);
        contractOwner = payable(msg.sender);
    }

    function setInterestRate (uint256 precentage) public onlyCentralBank {
        // Enabling change of interest rate by the central bank.
        INTEREST_RATE = precentage;
    }

    function getInterestRate () public view returns(uint256) {
        // Returning interest rate value
        return INTEREST_RATE;
    }

    function borrow(address borrower, uint256 amount, uint256 duration) public onlyCentralBank returns (uint256 loanId, uint256 repayAmount, uint256 dueDate, string memory) {
        // Borrow InflaToken function, setting a due date

        // Initial balance check. Loan Id 0 represents error.
        if(inflaToken.balanceOf(contractOwner) < amount) return (0, 0, 0, "Insufficient contract token balance");

        uint256 resDueDate = block.timestamp + duration;

        loans[loanCounter] = Loan({
            borrower: borrower,
            amount: amount,
            interest: INTEREST_RATE,
            dueDate: resDueDate,
            isRepaid: false
        });

        loanCounter++;

        // Transfer tokens from the contract to the borrower
        inflaToken.transferTo('borrow', contractOwner, borrower, amount);

        // Return loan id
        return (loanCounter, amount + ((amount * INTEREST_RATE) / 100), resDueDate, "The loan has been approved and processed successfully");
    }

    // Repay function to repay borrowed tokens
    function repay(uint256 loanId) public onlyCentralBank {
        Loan storage loan = loans[loanId];
        require(loan.isRepaid == false, "Loan already repaid");
        require(block.timestamp >= loan.dueDate, "Loan is not overdue");

        // Calculate repay amount with interest
        uint256 repayAmount = loan.amount + ((loan.amount * INTEREST_RATE) / 100);

        // Transfer tokens back to the contract
        inflaToken.transferTo('repay', loan.borrower, contractOwner, repayAmount);
        loan.isRepaid = true;
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
// MODIFIERS
// -----------------------------------

    modifier onlyCentralBank {
        require(msg.sender == inflaTokenAddress, "Only the centralBank can call this function.");
        _;
    }

}
