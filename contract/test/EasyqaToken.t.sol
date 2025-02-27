// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Test.sol";
import "../contracts/EasyqaToken.sol";

contract EasyqaTokenTest is Test {
    EasyqaToken token;
    address owner;
    address recipient;
    address spender;

    function setUp() public {
        token = new EasyqaToken();
        owner = address(this);
        recipient = address(0x456);
        spender = address(0x123);
    }

    // Verify that the token starts with zero supply
    function testInitialSupply() public view {
        assertEq(token.totalSupply(), 0, "Initial supply should be zero");
        assertEq(
            token.balanceOf(owner),
            0,
            "Owner should have zero tokens initially"
        );
    }

    // Test minting tokens
    function testMint() public {
        token.mint(owner, 100 ether);
        assertEq(
            token.totalSupply(),
            100 ether,
            "Total supply should be 100 ether after minting"
        );
        assertEq(
            token.balanceOf(owner),
            100 ether,
            "Owner balance should be 100 ether after minting"
        );
    }

    // Test transferring tokens from the owner to a recipient
    function testTransfer() public {
        token.mint(owner, 100 ether);
        bool success = token.transfer(recipient, 50 ether);
        assertTrue(success, "Transfer should succeed");
        assertEq(
            token.balanceOf(owner),
            50 ether,
            "Owner balance should decrease by 50 ether"
        );
        assertEq(
            token.balanceOf(recipient),
            50 ether,
            "Recipient balance should increase by 50 ether"
        );
    }

    // Test the approve and transferFrom mechanism
    function testApproveAndTransferFrom() public {
        token.mint(owner, 100 ether);
        token.approve(spender, 75 ether);
        assertEq(
            token.allowance(owner, spender),
            75 ether,
            "Allowance should be 75 ether"
        );

        // Simulate the spender initiating the transfer
        vm.prank(spender);
        bool success = token.transferFrom(owner, recipient, 75 ether);
        assertTrue(success, "transferFrom should succeed");

        assertEq(
            token.balanceOf(owner),
            25 ether,
            "Owner balance should be reduced by 75 ether"
        );
        assertEq(
            token.balanceOf(recipient),
            75 ether,
            "Recipient balance should be increased by 75 ether"
        );
        assertEq(
            token.allowance(owner, spender),
            0,
            "Allowance should be consumed"
        );
    }
}
