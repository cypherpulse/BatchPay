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
}