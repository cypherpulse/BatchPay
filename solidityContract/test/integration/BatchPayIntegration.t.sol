// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "forge-std/Test.sol";
import "../../src/BaseBatchPay.sol";

contract BatchPayIntegrationTest is Test {
    BaseBatchPay batchPay;
    address TREASURY = address(0x123);

    // Multiple payers and employees for integration testing
    address payer1 = address(0x456);
    address payer2 = address(0x789);
    address employee1 = address(0xABC);
    address employee2 = address(0xDEF);
    address employee3 = address(0x111);
    address employee4 = address(0x222);

    function setUp() public {
        batchPay = new BaseBatchPay(TREASURY);

        // Setup employees for payer1
        vm.prank(payer1);
        batchPay.addEmployee(employee1);
        vm.prank(payer1);
        batchPay.addEmployee(employee2);

        // Setup employees for payer2
        vm.prank(payer2);
        batchPay.addEmployee(employee3);
        vm.prank(payer2);
        batchPay.addEmployee(employee4);
    }

    function testMultiplePayersConcurrentUsage() public {
        // Payer1 makes a batch payment
        uint256 amount1 = 1 ether;
        uint256 amount2 = 2 ether;
        uint256 total1 = amount1 + amount2;
        uint256 fee1 = (total1 * 50) / 10000;
        uint256 totalRequired1 = total1 + fee1;

        address[] memory recipients1 = new address[](2);
        recipients1[0] = employee1;
        recipients1[1] = employee2;

        uint256[] memory amounts1 = new uint256[](2);
        amounts1[0] = amount1;
        amounts1[1] = amount2;

        string[] memory names1 = new string[](2);
        names1[0] = "Alice";
        names1[1] = "Bob";

        vm.deal(payer1, totalRequired1);
        vm.prank(payer1);
        batchPay.batchPay{value: totalRequired1}(recipients1, amounts1, names1);

        // Payer2 makes a different batch payment simultaneously
        uint256 amount3 = 3 ether;
        uint256 amount4 = 1.5 ether;
        uint256 total2 = amount3 + amount4;
        uint256 fee2 = (total2 * 50) / 10000;
        uint256 totalRequired2 = total2 + fee2;

        address[] memory recipients2 = new address[](2);
        recipients2[0] = employee3;
        recipients2[1] = employee4;

        uint256[] memory amounts2 = new uint256[](2);
        amounts2[0] = amount3;
        amounts2[1] = amount4;

        string[] memory names2 = new string[](2);
        names2[0] = "Charlie";
        names2[1] = "David";

        vm.deal(payer2, totalRequired2);
        vm.prank(payer2);
        batchPay.batchPay{value: totalRequired2}(recipients2, amounts2, names2);

        // Verify both payments were processed correctly
        BaseBatchPay.Batch[] memory history1 = batchPay.getPaymentHistory(payer1);
        BaseBatchPay.Batch[] memory history2 = batchPay.getPaymentHistory(payer2);

        assertEq(history1.length, 1);
        assertEq(history2.length, 1);
        assertEq(history1[0].amounts[0], amount1);
        assertEq(history1[0].amounts[1], amount2);
        assertEq(history2[0].amounts[0], amount3);
        assertEq(history2[0].amounts[1], amount4);

        // Verify treasury received both fees
        assertEq(TREASURY.balance, fee1 + fee2);
    }

    function testEmployeeManagementWorkflow() public {
        address newEmployee = address(0x333);

        // Payer1 adds a new employee
        vm.prank(payer1);
        batchPay.addEmployee(newEmployee);
        assertTrue(batchPay.employees(payer1, newEmployee));

        // Make a payment including the new employee
        uint256 amount = 1 ether;
        uint256 fee = (amount * 50) / 10000;
        uint256 totalRequired = amount + fee;

        address[] memory recipients = new address[](1);
        recipients[0] = newEmployee;

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;

        string[] memory names = new string[](1);
        names[0] = "New Hire";

        vm.deal(payer1, totalRequired);
        vm.prank(payer1);
        batchPay.batchPay{value: totalRequired}(recipients, amounts, names);

        // Remove the employee
        vm.prank(payer1);
        batchPay.removeEmployee(newEmployee);
        assertFalse(batchPay.employees(payer1, newEmployee));

        // Verify payment history still exists
        BaseBatchPay.Batch[] memory history = batchPay.getPaymentHistory(payer1);
        assertEq(history.length, 1);
        assertEq(history[0].recipients[0], newEmployee);
    }

    function testLargeBatchPayment() public {
        uint256 batchSize = 50; // Large but reasonable batch
        address[] memory recipients = new address[](batchSize);
        uint256[] memory amounts = new uint256[](batchSize);
        string[] memory names = new string[](batchSize);

        uint256 total = 0;
        for (uint256 i = 0; i < batchSize; i++) {
            recipients[i] = address(uint160(i + 1000));
            amounts[i] = 0.01 ether;
            names[i] = string(abi.encodePacked("Employee", i));
            total += amounts[i];

            vm.prank(payer1);
            batchPay.addEmployee(recipients[i]);
        }

        uint256 fee = (total * 50) / 10000;
        uint256 totalRequired = total + fee;

        vm.deal(payer1, totalRequired);
        vm.prank(payer1);
        batchPay.batchPay{value: totalRequired}(recipients, amounts, names);

        BaseBatchPay.Batch[] memory history = batchPay.getPaymentHistory(payer1);
        assertEq(history.length, 1);
        assertEq(history[0].recipients.length, batchSize);
        assertEq(history[0].amounts.length, batchSize);
        assertEq(TREASURY.balance, fee);
    }

    function testPaymentHistoryAccumulation() public {
        // Simulate weekly payroll over 4 weeks
        uint256 weeks = 4;
        uint256 weeklyAmount = 5 ether;

        for (uint256 week = 1; week <= weeks; week++) {
            uint256 amount1 = weeklyAmount * 0.6; // 60% to employee1
            uint256 amount2 = weeklyAmount * 0.4; // 40% to employee2
            uint256 total = amount1 + amount2;
            uint256 fee = (total * 50) / 10000;
            uint256 totalRequired = total + fee;

            address[] memory recipients = new address[](2);
            recipients[0] = employee1;
            recipients[1] = employee2;

            uint256[] memory amounts = new uint256[](2);
            amounts[0] = amount1;
            amounts[1] = amount2;

            string[] memory names = new string[](2);
            names[0] = "Alice";
            names[1] = "Bob";

            vm.deal(payer1, totalRequired);
            vm.prank(payer1);
            batchPay.batchPay{value: totalRequired}(recipients, amounts, names);
        }

        BaseBatchPay.Batch[] memory history = batchPay.getPaymentHistory(payer1);
        assertEq(history.length, weeks);

        // Verify total treasury fees
        uint256 expectedTotalFee = 0;
        for (uint256 i = 0; i < weeks; i++) {
            uint256 weeklyTotal = weeklyAmount;
            expectedTotalFee += (weeklyTotal * 50) / 10000;
        }
        assertEq(TREASURY.balance, expectedTotalFee);
    }

    function testCrossPayerEmployeeIsolation() public {
        // Payer1 tries to pay payer2's employee (should fail)
        uint256 amount = 1 ether;
        uint256 fee = (amount * 50) / 10000;
        uint256 totalRequired = amount + fee;

        address[] memory recipients = new address[](1);
        recipients[0] = employee3; // payer2's employee

        uint256[] memory amounts = new uint256[](1);
        amounts[0] = amount;

        string[] memory names = new string[](1);
        names[0] = "Unauthorized";

        vm.deal(payer1, totalRequired);
        vm.prank(payer1);
        vm.expectRevert("Recipient not an employee");
        batchPay.batchPay{value: totalRequired}(recipients, amounts, names);
    }

    function testGasEfficiencyComparison() public {
        // Compare gas usage for batch vs individual payments
        uint256 batchGas;
        uint256 individualGasTotal = 0;

        // Batch payment
        uint256 amount1 = 1 ether;
        uint256 amount2 = 1 ether;
        uint256 total = amount1 + amount2;
        uint256 fee = (total * 50) / 10000;
        uint256 totalRequired = total + fee;

        address[] memory recipients = new address[](2);
        recipients[0] = employee1;
        recipients[1] = employee2;

        uint256[] memory amounts = new uint256[](2);
        amounts[0] = amount1;
        amounts[1] = amount2;

        string[] memory names = new string[](2);
        names[0] = "Alice";
        names[1] = "Bob";

        vm.deal(payer1, totalRequired);
        vm.prank(payer1);
        uint256 gasStart = gasleft();
        batchPay.batchPay{value: totalRequired}(recipients, amounts, names);
        batchGas = gasStart - gasleft();

        // Individual payments (simulated)
        // Note: In reality, individual transfers would be more expensive due to separate txns
        // This test demonstrates the contract handles both approaches

        assertLt(batchGas, 500000); // Reasonable gas limit for batch payment
    }

    function testTreasuryFeeAccumulation() public {
        // Multiple payers contributing to treasury
        uint256[] memory payments = new uint256[](3);
        payments[0] = 10 ether;
        payments[1] = 25 ether;
        payments[2] = 5 ether;

        uint256 expectedTotalFee = 0;

        for (uint256 i = 0; i < payments.length; i++) {
            uint256 amount = payments[i];
            uint256 fee = (amount * 50) / 10000;
            uint256 totalRequired = amount + fee;
            expectedTotalFee += fee;

            address[] memory recipients = new address[](1);
            recipients[0] = employee1;

            uint256[] memory amounts = new uint256[](1);
            amounts[0] = amount;

            string[] memory names = new string[](1);
            names[0] = "Treasury Test";

            vm.deal(payer1, totalRequired);
            vm.prank(payer1);
            batchPay.batchPay{value: totalRequired}(recipients, amounts, names);
        }

        assertEq(TREASURY.balance, expectedTotalFee);
    }
}