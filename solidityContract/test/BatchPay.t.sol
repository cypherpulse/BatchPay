// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../src/BaseBatchPay.sol";

contract BatchPayTest is Test {
    BaseBatchPay batchPay;
    address TREASURY = address(0x123);
    address payer = address(0x456);
    address recipient1 = address(0x789);
    address recipient2 = address(0xABC);
    address nonEmployee = address(0xDEF);

    function setUp() public {
        batchPay = new BaseBatchPay(TREASURY);
        vm.prank(payer);
        batchPay.addEmployee(recipient1);
        vm.prank(payer);
        batchPay.addEmployee(recipient2);
    }

    function testBatchPaySuccess() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;
        uint256 total = amount1 + amount2;
        uint256 fee = (total * 50) / 10000; // 0.5%
        uint256 totalRequired = total + fee;

        address[] memory recipients = new address[](2);
        recipients[0] = recipient1;
        recipients[1] = recipient2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = amount1;
        amounts[1] = amount2;

        string[] memory names = new string[](2);
        names[0] = "Alice";
        names[1] = "Bob";

        uint256 TREASURYBalanceBefore = TREASURY.balance;
        uint256 recipient1BalanceBefore = recipient1.balance;
        uint256 recipient2BalanceBefore = recipient2.balance;

        vm.deal(payer, totalRequired);

        vm.prank(payer);
        vm.expectEmit(true, false, false, true);
        emit BaseBatchPay.BatchPaid(payer, recipients, amounts, names, fee);
        batchPay.batchPay{value: totalRequired}(recipients, amounts, names);

        assertEq(TREASURY.balance, TREASURYBalanceBefore + fee);
        assertEq(recipient1.balance, recipient1BalanceBefore + amount1);
        assertEq(recipient2.balance, recipient2BalanceBefore + amount2);

        BaseBatchPay.Batch[] memory history = batchPay.getPaymentHistory(payer);
        assertEq(history.length, 1);
        assertEq(history[0].recipients.length, 2);
        assertEq(history[0].recipients[0], recipient1);
        assertEq(history[0].recipients[1], recipient2);
        assertEq(history[0].amounts[0], amount1);
        assertEq(history[0].amounts[1], amount2);
        assertEq(history[0].names[0], "Alice");
        assertEq(history[0].names[1], "Bob");
        assertEq(history[0].timestamp, block.timestamp);
    }

    function testFeeCalculation() public pure {
        uint256 total = 100 ether;
        uint256 fee = (total * 50) / 10000;
        assertEq(fee, 0.5 ether);
    }

    function testAddEmployee() public {
        vm.prank(payer);
        batchPay.addEmployee(nonEmployee);
        assertTrue(batchPay.employees(payer, nonEmployee));
    }

    function testRemoveEmployee() public {
        vm.prank(payer);
        batchPay.removeEmployee(recipient1);
        assertFalse(batchPay.employees(payer, recipient1));
    }

    function testRevertOnLengthMismatch() public {
        address[] memory recipients = new address[](2);
        recipients[0] = recipient1;
        recipients[1] = recipient2;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 1 ether;

        string[] memory names = new string[](2);
        names[0] = "Alice";
        names[1] = "Bob";

        vm.deal(payer, 10 ether);
        vm.prank(payer);
        vm.expectRevert("Array lengths mismatch");
        batchPay.batchPay{value: 10 ether}(recipients, amounts, names);
    }

    function testRevertOnInsufficientValue() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;
        uint256 total = amount1 + amount2;
        uint256 fee = (total * 50) / 10000;
        uint256 insufficient = total + fee - 1;

        address[] memory recipients = new address[](2);
        recipients[0] = recipient1;
        recipients[1] = recipient2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = amount1;
        amounts[1] = amount2;

        string[] memory names = new string[](2);
        names[0] = "Alice";
        names[1] = "Bob";

        vm.deal(payer, insufficient);
        vm.prank(payer);
        vm.expectRevert("Insufficient ETH sent");
        batchPay.batchPay{value: insufficient}(recipients, amounts, names);
    }

    function testRevertOnNonEmployee() public {
        uint256 total = 1 ether;
        uint256 fee = (total * 50) / 10000;
        uint256 totalRequired = total + fee;

        address[] memory recipients = new address[](1);
        recipients[0] = nonEmployee;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = total;

        string[] memory names = new string[](1);
        names[0] = "NonEmployee";

        vm.deal(payer, totalRequired);
        vm.prank(payer);
        vm.expectRevert("Recipient not an employee");
        batchPay.batchPay{value: totalRequired}(recipients, amounts, names);
    }

    function testRevertOnDuplicateRecipient() public {
        uint256 total = 2 ether;
        uint256 fee = (total * 50) / 10000;
        uint256 totalRequired = total + fee;

        address[] memory recipients = new address[](2);
        recipients[0] = recipient1;
        recipients[1] = recipient1; // duplicate

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = 1 ether;
        amounts[1] = 1 ether;

        string[] memory names = new string[](2);
        names[0] = "Alice";
        names[1] = "Alice";

        vm.deal(payer, totalRequired);
        vm.prank(payer);
        vm.expectRevert("Duplicate recipient");
        batchPay.batchPay{value: totalRequired}(recipients, amounts, names);
    }

    function testRevertOnZeroAmount() public {
        address[] memory recipients = new address[](1);
        recipients[0] = recipient1;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = 0; // zero amount

        string[] memory names = new string[](1);
        names[0] = "Alice";

        vm.deal(payer, 1 ether);
        vm.prank(payer);
        vm.expectRevert("Amount must be positive");
        batchPay.batchPay{value: 1 ether}(recipients, amounts, names);
    }

    function testRevertOnZeroAddress() public {
        uint256 total = 1 ether;
        uint256 fee = (total * 50) / 10000;
        uint256 totalRequired = total + fee;

        address[] memory recipients = new address[](1);
        recipients[0] = address(0); // zero address

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = total;

        string[] memory names = new string[](1);
        names[0] = "Zero";

        vm.deal(payer, totalRequired);
        vm.prank(payer);
        vm.expectRevert("Invalid recipient");
        batchPay.batchPay{value: totalRequired}(recipients, amounts, names);
    }

    function testEmployeeAddedEvent() public {
        vm.prank(payer);
        vm.expectEmit(true, true, false, false);
        emit BaseBatchPay.EmployeeAdded(payer, nonEmployee);
        batchPay.addEmployee(nonEmployee);
    }

    function testEmployeeRemovedEvent() public {
        vm.prank(payer);
        vm.expectEmit(true, true, false, false);
        emit BaseBatchPay.EmployeeRemoved(payer, recipient1);
        batchPay.removeEmployee(recipient1);
    }

    function testMultipleBatchesFromSamePayer() public {
        // First batch
        uint256 amount1 = 1 ether;
        uint256 fee1 = (amount1 * 50) / 10000;
        uint256 totalRequired1 = amount1 + fee1;

        address[] memory recipients1 = new address[](1);
        recipients1[0] = recipient1;
        uint256[] memory amounts1 = new uint256[](1);
        amounts1[0] = amount1;
        string[] memory names1 = new string[](1);
        names1[0] = "Alice";

        vm.deal(payer, totalRequired1);
        vm.prank(payer);
        batchPay.batchPay{value: totalRequired1}(recipients1, amounts1, names1);

        // Second batch
        uint256 amount2 = 2 ether;
        uint256 fee2 = (amount2 * 50) / 10000;
        uint256 totalRequired2 = amount2 + fee2;

        address[] memory recipients2 = new address[](1);
        recipients2[0] = recipient2;
        uint256[] memory amounts2 = new uint256[](1);
        amounts2[0] = amount2;
        string[] memory names2 = new string[](1);
        names2[0] = "Bob";

        vm.deal(payer, totalRequired2);
        vm.prank(payer);
        batchPay.batchPay{value: totalRequired2}(recipients2, amounts2, names2);

        BaseBatchPay.Batch[] memory history = batchPay.getPaymentHistory(payer);
        assertEq(history.length, 2);
        assertEq(history[0].amounts[0], amount1);
        assertEq(history[1].amounts[0], amount2);
    }

    function testLargeBatchPayment() public {
        uint256 numRecipients = 50;
        address[] memory recipients = new address[](numRecipients);
        uint256[] memory amounts = new uint256[](numRecipients);
        string[] memory names = new string[](numRecipients);

        uint256 totalAmount = 0;
        for (uint256 i = 0; i < numRecipients; i++) {
            recipients[i] = address(uint160(uint256(keccak256(abi.encodePacked(i)))));
            amounts[i] = (i + 1) * 0.1 ether;
            totalAmount += amounts[i];
            names[i] = string(abi.encodePacked("Employee", vm.toString(i)));

            vm.prank(payer);
            batchPay.addEmployee(recipients[i]);
        }

        uint256 fee = (totalAmount * 50) / 10000;
        uint256 totalRequired = totalAmount + fee;

        vm.deal(payer, totalRequired);
        vm.prank(payer);
        batchPay.batchPay{value: totalRequired}(recipients, amounts, names);

        BaseBatchPay.Batch[] memory history = batchPay.getPaymentHistory(payer);
        assertEq(history.length, 1);
        assertEq(history[0].recipients.length, numRecipients);
        assertEq(history[0].amounts.length, numRecipients);
    }

    function testGetPaymentHistoryEmpty() public {
        BaseBatchPay.Batch[] memory history = batchPay.getPaymentHistory(address(0x999));
        assertEq(history.length, 0);
    }

    function testBatchPayWithEmptyArrays() public {
        address[] memory recipients = new address[](0);
        uint256[] memory amounts = new uint256[](0);
        string[] memory names = new string[](0);

        vm.prank(payer);
        vm.expectRevert("No recipients provided");
        batchPay.batchPay{value: 0}(recipients, amounts, names);
    }

    function testAddEmployeeTwice() public {
        vm.prank(payer);
        batchPay.addEmployee(nonEmployee);
        assertTrue(batchPay.employees(payer, nonEmployee));

        // Adding again should not revert but remain true
        vm.prank(payer);
        batchPay.addEmployee(nonEmployee);
        assertTrue(batchPay.employees(payer, nonEmployee));
    }

    function testRemoveNonExistentEmployee() public {
        vm.prank(payer);
        batchPay.removeEmployee(nonEmployee);
        assertFalse(batchPay.employees(payer, nonEmployee));
    }

    function testFeeCalculationEdgeCases() public pure {
        // Test with very small amounts
        uint256 smallAmount = 1 wei;
        uint256 smallFee = (smallAmount * 50) / 10000;
        assertEq(smallFee, 0); // Should be 0 due to integer division

        // Test with large amounts
        uint256 largeAmount = 1000000 ether;
        uint256 largeFee = (largeAmount * 50) / 10000;
        assertEq(largeFee, 50000 ether);
    }

    function testOverflowProtection() public {
        // Test that fee calculation doesn't overflow
        uint256 maxAmount = type(uint256).max;
        uint256 fee = (maxAmount * 50) / 10000;
        // This should not revert and fee should be reasonable
        assertTrue(fee > 0);
    }

    function testBatchPayEventDetails() public {
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;
        uint256 total = amount1 + amount2;
        uint256 fee = (total * 50) / 10000;
        uint256 totalRequired = total + fee;

        address[] memory recipients = new address[](2);
        recipients[0] = recipient1;
        recipients[1] = recipient2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = amount1;
        amounts[1] = amount2;

        string[] memory names = new string[](2);
        names[0] = "Alice";
        names[1] = "Bob";

        vm.deal(payer, totalRequired);

        vm.prank(payer);
        vm.expectEmit(true, false, false, true);
        emit BaseBatchPay.BatchPaid(payer, recipients, amounts, names, fee);
        batchPay.batchPay{value: totalRequired}(recipients, amounts, names);
    }
}