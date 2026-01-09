// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

/// @title BaseBatchPay - Multi-Payment System for Payroll on Base
/// @author cypherpulse.base.eth
/// @notice A secure batch payment contract for payroll with 0.5% fee collection
/// @dev Implements employee management, duplicate prevention, and reentrancy protection


contract BaseBatchPay is Ownable, ReentrancyGuard {
    /// @notice The treasury address that receives all fees (immutable)
    address public immutable TREASURY;
    /// @notice Fee basis points (50 = 0.5%)
    uint256 public constant FEE_BPS = 50;

    /// @notice Mapping of payer to employee addresses and their active status
    mapping(address => mapping(address => bool)) public employees;
    /// @notice Mapping of payer to their payment history batches
    mapping(address => Batch[]) public paymentHistory;

    /// @notice Struct representing a batch payment
    /// @dev Contains all details of a single batch transaction
    struct Batch {
        address[] recipients;  /// @notice List of recipient addresses
        uint256[] amounts;     /// @notice Corresponding payment amounts
        string[] names;        /// @notice Names associated with recipients
        uint256 timestamp;     /// @notice Block timestamp of the payment
    }

    /// @notice Emitted when a batch payment is successfully processed
    /// @param payer The address initiating the payment
    /// @param recipients Array of recipient addresses
    /// @param amounts Array of payment amounts
    /// @param names Array of recipient names
    /// @param fee The fee amount collected
    event BatchPaid(
        address indexed payer,
        address[] recipients,
        uint256[] amounts,
        string[] names,
        uint256 fee
    );

    /// @notice Emitted when an employee is added
    /// @param payer The address adding the employee
    /// @param employee The employee address being added
    event EmployeeAdded(address indexed payer, address indexed employee);

    /// @notice Emitted when an employee is removed
    /// @param payer The address removing the employee
    /// @param employee The employee address being removed
    event EmployeeRemoved(address indexed payer, address indexed employee);

    /// @notice Contract constructor
    /// @param _treasury The address to receive fees (also set as contract owner)
    /// @dev Initializes treasury and ownership
    constructor(address _treasury) Ownable(_treasury) {
        require(_treasury != address(0), "Invalid treasury");
        TREASURY = _treasury;
    }

    /// @notice Adds an employee to the payer's list
    /// @param emp The address of the employee to add
    /// @dev Only the caller can add employees for themselves
    function addEmployee(address emp) external {
        require(emp != address(0), "Invalid employee address");
        employees[msg.sender][emp] = true;
        emit EmployeeAdded(msg.sender, emp);
    }

    /// @notice Removes an employee from the payer's list
    /// @param emp The address of the employee to remove
    /// @dev Only the caller can remove employees from their list
    function removeEmployee(address emp) external {
        employees[msg.sender][emp] = false;
        emit EmployeeRemoved(msg.sender, emp);
    }

    /// @notice Checks if an address is an active employee for the caller
    /// @param emp The address to check
    /// @return True if the address is an active employee
    function isEmployee(address emp) external view returns (bool) {
        return employees[msg.sender][emp];
    }

    /// @notice Processes a batch payment to multiple employees
    /// @param recipients Array of employee addresses to pay
    /// @param amounts Array of amounts to pay each recipient
    /// @param names Array of names corresponding to recipients
    /// @dev Requires all recipients to be active employees, no duplicates, valid inputs
    /// @dev Fee is calculated as 0.5% of total amount and sent to treasury
    function batchPay(
        address[] calldata recipients,
        uint256[] calldata amounts,
        string[] calldata names
    ) external payable nonReentrant {
        require(
            recipients.length == amounts.length && amounts.length == names.length,
            "Array lengths mismatch"
        );
        require(recipients.length > 0 && recipients.length <= 100, "Invalid batch size");

        // Check for duplicates and validations
        for (uint256 i = 0; i < recipients.length; i++) {
            require(recipients[i] != address(0), "Invalid recipient");
            require(amounts[i] > 0, "Amount must be positive");
            require(employees[msg.sender][recipients[i]], "Recipient not an employee");
            for (uint256 j = i + 1; j < recipients.length; j++) {
                require(recipients[i] != recipients[j], "Duplicate recipient");
            }
        }

        uint256 total = 0;
        for (uint256 i = 0; i < amounts.length; i++) {
            total += amounts[i];
        }

        uint256 fee = (total * FEE_BPS) / 10000;
        require(msg.value >= total + fee, "Insufficient ETH sent");

        payable(TREASURY).transfer(fee);

        for (uint256 i = 0; i < recipients.length; i++) {
            payable(recipients[i]).transfer(amounts[i]);
        }

        paymentHistory[msg.sender].push(
            Batch({
                recipients: recipients,
                amounts: amounts,
                names: names,
                timestamp: block.timestamp
            })
        );

        emit BatchPaid(msg.sender, recipients, amounts, names, fee);
    }

    /// @notice Retrieves the payment history for a payer
    /// @param payer The address whose history to retrieve
    /// @return Array of Batch structs representing past payments
    function getPaymentHistory(address payer)
        external
        view
        returns (Batch[] memory)
    {
        return paymentHistory[payer];
    }
}