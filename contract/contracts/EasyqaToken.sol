// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "openzeppelin-contracts/contracts/token/ERC20/ERC20.sol";

contract EasyqaToken is ERC20 {
    constructor() ERC20("Easyqa Token", "EQA") {}

    function mint(address to, uint256 amount) external {
        _mint(to, amount);
    }
}
