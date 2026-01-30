// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../../src/BaseBatchPay.sol";

contract BatchPayFuzzTest is Test {
    BaseBatchPay batchPay;
    address TREASURY = address(0x123);
    address payer = address(0x456);
    address recipient1 = address(0x789);
    address recipient2 = address(0xABC);

    function setUp() public {
        batchPay = new BaseBatchPay(TREASURY);
        vm.prank(payer);
        batchPay.addEmployee(recipient1);
        vm.prank(payer);
        batchPay.addEmployee(recipient2);
    }

    function testFuzzBatchPay(uint256 amount1, uint256 amount2, uint256 amount3) public {
        // Bound inputs to reasonable ranges to prevent overflow
        amount1 = bound(amount1, 0.001 ether, 10 ether);
        amount2 = bound(amount2, 0.001 ether, 10 ether);
        amount3 = bound(amount3, 0.001 ether, 10 ether);

        uint256 total = amount1 + amount2 + amount3;
        uint256 fee = (total * 50) / 10000;
        uint256 totalRequired = total + fee;

        address[] memory recipients = new address[](3);
        recipients[0] = recipient1;
        recipients[1] = recipient2;
        recipients[2] = address(0xABC);

        uint256[] memory amounts = new uint256[](3);
        amounts[0] = amount1;
        amounts[1] = amount2;
        amounts[2] = amount3;

        string[] memory names = new string[](3);
        names[0] = "Alice";
        names[1] = "Bob";
        names[2] = "Charlie";

        // Add third employee
        vm.prank(payer);
        batchPay.addEmployee(recipients[2]);

        uint256 treasuryBalanceBefore = TREASURY.balance;
        uint256 recipient1BalanceBefore = recipient1.balance;
        uint256 recipient2BalanceBefore = recipient2.balance;
        uint256 recipient3BalanceBefore = recipients[2].balance;

        vm.deal(payer, totalRequired);
        vm.prank(payer);
        batchPay.batchPay{value: totalRequired}(recipients, amounts, names);

        assertEq(TREASURY.balance, treasuryBalanceBefore + fee);
        assertEq(recipient1.balance, recipient1BalanceBefore + amount1);
        assertEq(recipient2.balance, recipient2BalanceBefore + amount2);
        assertEq(recipients[2].balance, recipient3BalanceBefore + amount3);

        BaseBatchPay.Batch[] memory history = batchPay.getPaymentHistory(payer);
        assertEq(history.length, 1);
        assertEq(history[0].amounts[0], amount1);
        assertEq(history[0].amounts[1], amount2);
        assertEq(history[0].amounts[2], amount3);
    }

    function testFuzzFeeCalculation(uint256 totalAmount) public {
        totalAmount = bound(totalAmount, 0.001 ether, 1000 ether);
        uint256 expectedFee = (totalAmount * 50) / 10000;
        uint256 calculatedFee = (totalAmount * 50) / 10000;
        assertEq(calculatedFee, expectedFee);
    }

    function testFuzzEmployeeManagement(address randomEmployee) public {
        vm.assume(randomEmployee != address(0));
        vm.assume(randomEmployee != payer);

        vm.prank(payer);
        batchPay.addEmployee(randomEmployee);
        assertTrue(batchPay.employees(payer, randomEmployee));

        vm.prank(payer);
        batchPay.removeEmployee(randomEmployee);
        assertFalse(batchPay.employees(payer, randomEmployee));
    }

    function testFuzzBatchSize(uint8 size) public {
        size = uint8(bound(size, 1, 10)); // Test smaller batches for fuzzing

        address[] memory recipients = new address[](size);
        uint256[] memory amounts = new uint256[](size);
        string[] memory names = new string[](size);

        uint256 total = 0;
        for (uint256 i = 0; i < size; i++) {
            recipients[i] = address(uint160(uint256(keccak256(abi.encode(i, size)))));
            amounts[i] = 0.1 ether;
            names[i] = string(abi.encodePacked("Employee", i));
            total += amounts[i];

            vm.prank(payer);
            batchPay.addEmployee(recipients[i]);
        }

        uint256 fee = (total * 50) / 10000;
        uint256 totalRequired = total + fee;

        vm.deal(payer, totalRequired);
        vm.prank(payer);
        batchPay.batchPay{value: totalRequired}(recipients, amounts, names);

        BaseBatchPay.Batch[] memory history = batchPay.getPaymentHistory(payer);
        assertEq(history[history.length - 1].recipients.length, size);
    }

    function testFuzzPaymentAmounts(uint256[] calldata amounts) public {
        uint256 length = amounts.length;
        length = bound(length, 1, 5); // Reasonable bounds

        address[] memory recipients = new address[](length);
        uint256[] memory boundedAmounts = new uint256[](length);
        string[] memory names = new string[](length);

        uint256 total = 0;
        for (uint256 i = 0; i < length; i++) {
            recipients[i] = address(uint160(uint256(keccak256(abi.encode(i)))));
            boundedAmounts[i] = bound(amounts[i % amounts.length], 0.001 ether, 1 ether);
            names[i] = string(abi.encodePacked("User", i));
            total += boundedAmounts[i];

            vm.prank(payer);
            batchPay.addEmployee(recipients[i]);
        }

        uint256 fee = (total * 50) / 10000;
        uint256 totalRequired = total + fee;

        vm.deal(payer, totalRequired);
        vm.prank(payer);
        batchPay.batchPay{value: totalRequired}(recipients, boundedAmounts, names);

        BaseBatchPay.Batch[] memory history = batchPay.getPaymentHistory(payer);
        assertEq(history[history.length - 1].amounts.length, length);
    }
}