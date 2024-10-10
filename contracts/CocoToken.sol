// SPDX-License-Identifier: MIT

pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Capped.sol";
import "@openzeppelin/contracts/token/ERC20/extensions/ERC20Burnable.sol";

contract CocoToken is ERC20Capped, ERC20Burnable {

    address payable public owner;
    uint256 public blockReward;

    constructor (uint256 cap, uint256 reward)
    ERC20("CocoToken", "CCT")
    ERC20Capped(cap * (10 ** decimals())) {
        owner = payable(msg.sender);
        blockReward = reward * (10 ** decimals());
        _mint(owner, 70000000 * (10 ** decimals()));
    }

    function _mintMinerReward() internal {
        _mint(block.coinbase, blockReward);
    }

    function _update(address from, address to, uint256 value) internal virtual override(ERC20Capped, ERC20) {
        if(from != address(0) && block.coinbase != address(0) && to != block.coinbase) {
            _mintMinerReward();
        }
        super._update(from, to, value);
    }

    function transfer(address to, uint256 value) public virtual override(ERC20) returns(bool){
        return super.transfer(to, value * (10 ** decimals()));
    }

    function setBlockReward (uint256 reward) public onlyOwner {
        blockReward = reward * (10 ** decimals());
    }

    function destroy() public onlyOwner() {
        selfdestruct(owner);
    }

    modifier onlyOwner {
        require(msg.sender == owner, "Only the owner can change the block reward");
        _;
    }
}