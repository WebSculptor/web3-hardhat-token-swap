// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

import "./tokens/CohortXToken.sol";
import "./tokens/Web3BridgeToken.sol";

contract TokenSwap {
    address payable admin;
    uint256 public ratioAX;
    uint256 public fees;

    CohortXToken public tokenCTX;
    Web3BridgeToken public tokenWCX;

    constructor(address _tokenCTX, address _tokenWCX) {
        admin = payable(msg.sender);

        tokenCTX = CohortXToken(_tokenCTX);
        tokenWCX = Web3BridgeToken(_tokenWCX);

        tokenCTX.approve(address(this), type(uint256).max);
        tokenWCX.approve(address(this), type(uint256).max);
    }

    modifier onlyAdmin() {
        require(msg.sender == admin, "Only admin can call this function");
        _;
    }

    function setRatio(uint256 _ratio) public onlyAdmin {
        ratioAX = _ratio;
    }

    function getRatio() public view returns (uint256) {
        return ratioAX;
    }

    function setFees(uint256 _fees) public onlyAdmin {
        fees = _fees;
    }

    function getFees() public view returns (uint256) {
        return fees;
    }

    function swapFromCTX(uint256 _amount) public returns (uint256) {
        require(_amount > 0, "Amount must be greater than zero");
        require(
            tokenCTX.balanceOf(msg.sender) >= _amount,
            "Insufficient balance"
        );

        uint256 exchangeA = (_amount * ratioAX) / 100;
        uint256 exchangeAmount = exchangeA - (exchangeA * fees) / 100;
        require(
            exchangeAmount > 0,
            "Exchange amount must be greater than zero"
        );
        require(
            tokenWCX.balanceOf(address(this)) >= exchangeAmount,
            "Insufficient liquidity"
        );

        tokenCTX.transferFrom(msg.sender, address(this), _amount);
        tokenWCX.transfer(msg.sender, exchangeAmount);
        return exchangeAmount;
    }

    function swapFromWCX(uint256 _amount) public returns (uint256) {
        require(_amount > 0, "Amount must be greater than zero");
        require(
            tokenWCX.balanceOf(msg.sender) >= _amount,
            "Insufficient balance"
        );

        uint256 exchangeA = _amount / ratioAX;
        uint256 exchangeAmount = exchangeA - (exchangeA * fees) / 100;
        require(
            exchangeAmount > 0,
            "Exchange amount must be greater than zero"
        );
        require(
            tokenCTX.balanceOf(address(this)) >= exchangeAmount,
            "Insufficient liquidity"
        );

        tokenWCX.transferFrom(msg.sender, address(this), _amount);
        tokenCTX.transfer(msg.sender, exchangeAmount);
        return exchangeAmount;
    }

    function buyTokensCTX(uint256 _amount) public payable onlyAdmin {
        tokenCTX.buyTokens{value: msg.value}(_amount);
    }

    function buyTokensWCX(uint256 _amount) public payable onlyAdmin {
        tokenWCX.buyTokens{value: msg.value}(_amount);
    }
}
