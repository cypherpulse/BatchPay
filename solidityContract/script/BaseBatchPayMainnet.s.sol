// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Script.sol";
import "../src/BaseBatchPay.sol";

contract BaseBatchPayMainnet is Script {
    function run() external {
        address treasury = vm.envAddress("TREASURY_ADDRESS");

        vm.startBroadcast();

        BaseBatchPay batchPay = new BaseBatchPay(treasury);

        vm.stopBroadcast();

        console.log("BaseBatchPay deployed to Base Mainnet at:", address(batchPay));
    }
}