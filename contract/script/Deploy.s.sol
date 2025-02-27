// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "forge-std/Script.sol";

import "../contracts/EasyqaToken.sol";

contract Deploy is Script {
	function run() external {
		// Load environment variables
		uint256 deployerPrivateKey = vm.envUint("DEPLOYER_KEY");

		// Start broadcasting transactions
		vm.startBroadcast(deployerPrivateKey);

		// Deploy the Token contract
		EasyqaToken token = new EasyqaToken();
		console.log("Wordle Token deployed at:", address(token));

		// Stop broadcasting transactions
		vm.stopBroadcast();
	}
}
