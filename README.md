# BatchPay

![Base Network](https://img.shields.io/badge/Network-Base-blue) ![Solidity](https://img.shields.io/badge/Solidity-^0.8.0-blue) ![Foundry](https://img.shields.io/badge/Foundry-Enabled-green) ![License](https://img.shields.io/badge/License-MIT-yellow)


![BaseBatchPay](assets/payB.png)
## Table of Contents

- [BatchPay](#batchpay)
  - [Table of Contents](#table-of-contents)
  - [Overview](#overview)
  - [Features](#features)
  - [Architecture](#architecture)
    - [System Overview](#system-overview)
    - [Batch Payment Flow](#batch-payment-flow)
    - [Smart Contract Architecture](#smart-contract-architecture)
    - [Frontend Component Structure](#frontend-component-structure)
    - [Deployment Workflow](#deployment-workflow)
    - [User Journey](#user-journey)
  - [Prerequisites](#prerequisites)
  - [Installation](#installation)
  - [Usage](#usage)
    - [Smart Contract Development](#smart-contract-development)
    - [Frontend Development](#frontend-development)
  - [Smart Contract Details](#smart-contract-details)
    - [Batch Payment State Flow](#batch-payment-state-flow)
    - [Gas Optimization Strategy](#gas-optimization-strategy)
    - [Security Audit Checklist](#security-audit-checklist)
  - [Deployment](#deployment)
    - [Testnet Deployment](#testnet-deployment)
    - [Mainnet Deployment](#mainnet-deployment)
  - [Configuration](#configuration)
    - [Foundry Configuration](#foundry-configuration)
    - [Network Information](#network-information)
  - [Contributing](#contributing)
    - [Code Standards](#code-standards)
  - [License](#license)
  - [Support](#support)
  - [Roadmap](#roadmap)
  - [Disclaimer](#disclaimer)

## Overview

BatchPay is a decentralized application (dApp) designed to facilitate efficient batch payments on the Base blockchain network. This project consists of a Solidity smart contract for handling batch payment logic and a frontend interface for user interaction. The smart contract allows users to execute multiple payment transactions in a single blockchain transaction, reducing gas costs and improving efficiency for bulk transfers.

The project is built using Foundry for smart contract development and deployment, ensuring robust testing and reliable contract interactions. The frontend component provides an intuitive web interface for users to interact with the BatchPay contract, enabling seamless batch payment operations.

## Features

- **Batch Payment Execution**: Send multiple payments to different recipients in a single transaction
- **Gas Optimization**: Reduce transaction costs by batching multiple transfers
- **Secure Smart Contract**: Built with security best practices using OpenZeppelin libraries
- **Testnet and Mainnet Support**: Deployment scripts for both testnet and mainnet environments
- **Comprehensive Testing**: Extensive test suite using Foundry's testing framework
- **User-Friendly Frontend**: Web interface for easy contract interaction
- **Base Network Integration**: Optimized for the Base Layer 2 blockchain

## Architecture

### System Overview
```mermaid
graph TB
    subgraph "User Layer"
        A[Web Browser]
        B[Mobile Wallet]
    end

    subgraph "Frontend Layer"
        C[React App]
        D[ConnectKit]
        E[Wagmi Provider]
    end

    subgraph "Blockchain Layer"
        F[Base Network]
        G[BaseBatchPay Contract]
    end

    subgraph "External Services"
        H[WalletConnect]
        I[Infura/Alchemy RPC]
    end

    A --> C
    B --> H
    C --> D
    D --> E
    E --> F
    F --> G
    H --> E
    E --> I
```

### Batch Payment Flow
```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant W as Wallet
    participant C as Contract
    participant B as Blockchain

    U->>F: Upload CSV or Add Recipients Manually
    F->>F: Parse and Validate Data
    F->>U: Show Preview & Total Amount
    U->>F: Confirm Batch Payment
    F->>W: Request Transaction Signature
    W->>U: Show Transaction Details
    U->>W: Approve Transaction
    W->>F: Return Signed Transaction
    F->>B: Submit Batch Transaction
    B->>C: Execute batchPay Function
    C->>C: Process Each Payment
    C->>B: Emit Payment Events
    B->>F: Transaction Confirmation
    F->>U: Show Success Message
```

### Smart Contract Architecture
```mermaid
classDiagram
    class BaseBatchPay {
        +address owner
        +uint256 protocolFee
        +mapping(address => Payment[]) paymentHistory

        +batchPay(address[], uint256[])
        +getPaymentHistory(address)
        +withdrawFunds()
        +addEmployee(address)
        +removeEmployee(address)
        -_validateRecipients(address[], uint256[])
    }

    class Payment {
        +address recipient
        +uint256 amount
        +uint256 timestamp
        +bytes32 txHash
    }

    class Ownable {
        +address owner
        +transferOwnership(address)
        +renounceOwnership()
    }

    class ReentrancyGuard {
        -uint256 _status
        +nonReentrant()
    }

    BaseBatchPay --|> Ownable
    BaseBatchPay --|> ReentrancyGuard
    BaseBatchPay --> Payment
```

### Frontend Component Structure
```mermaid
graph TD
    A[App.tsx] --> B[Router]
    B --> C[Home Page]
    B --> D[Create Page]
    B --> E[History Page]
    B --> F[About Page]

    C --> G[Hero Component]
    C --> H[Features Component]

    D --> I[RecipientInput]
    I --> J[CSVUpload]
    I --> K[ManualInput]
    D --> L[PaymentPreview]
    D --> M[TransactionStatus]

    J --> N[CSV Parser]
    K --> O[Recipient Form]

    E --> P[Payment History List]
    E --> Q[Transaction Details]

    F --> R[About Content]
    F --> S[Technical Details]
```

### Deployment Workflow
```mermaid
flowchart TD
    A[Local Development] --> B[Write Tests]
    B --> C[Run Tests]
    C --> D{Tests Pass?}
    D -->|No| E[Fix Issues]
    E --> C
    D -->|Yes| F[Compile Contract]
    F --> G[Deploy to Testnet]
    G --> H[Verify Contract]
    H --> I[Frontend Integration]
    I --> J[End-to-End Testing]
    J --> K{Ready for Mainnet?}
    K -->|No| L[Iterate & Improve]
    L --> I
    K -->|Yes| M[Deploy to Mainnet]
    M --> N[Final Verification]
    N --> O[Production Ready]
```

### User Journey
```mermaid
journey
    title BatchPay User Experience
    section Discovery
      User discovers BatchPay: 5: User
      Reads documentation: 4: User
    section Setup
      Connects wallet: 5: User
      Switches to Base network: 4: User
    section Payment Creation
      Chooses input method: 5: User
      Uploads CSV or adds manually: 4: User
      Reviews payment details: 5: User
    section Execution
      Approves transaction: 5: User
      Waits for confirmation: 3: User
      Receives success feedback: 5: User
    section Management
      Views payment history: 4: User
      Tracks transaction status: 4: User
```

## Prerequisites

Before setting up the project, ensure you have the following installed:

- **Foundry**: For smart contract development and testing
  - Install via: `curl -L https://foundry.paradigm.xyz | bash`
  - Run: `foundryup`
- **Node.js** (version 16 or higher): For frontend development
- **npm** or **yarn**: Package manager for JavaScript dependencies
- **Git**: Version control system

## Installation

1. **Clone the Repository**
   ```bash
   git clone <repository-url>
   cd BatchPay
   ```

2. **Install Foundry Dependencies**
   ```bash
   cd solidityContract
   forge install
   ```

3. **Install Frontend Dependencies**
   ```bash
   # From the root directory
   npm install
   # or
   yarn install
   ```

4. **Set Up Environment Variables**
   Create a `.env` file in the root directory with necessary configuration:
   ```
   PRIVATE_KEY=your_private_key_here
   RPC_URL=https://mainnet.base.org
   ```

## Usage

### Smart Contract Development

1. **Compile Contracts**
   ```bash
   cd solidityContract
   forge build
   ```

2. **Run Tests**
   ```bash
   forge test
   ```

3. **Deploy to Testnet**
   ```bash
   forge script script/BaseBatchPayTestnet.s.sol --rpc-url <testnet-rpc> --private-key <private-key> --broadcast
   ```

4. **Deploy to Mainnet**
   ```bash
   forge script script/BaseBatchPayMainnet.s.sol --rpc-url <mainnet-rpc> --private-key <private-key> --broadcast
   ```

### Frontend Development

1. **Start Development Server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Build for Production**
   ```bash
   npm run build
   # or
   yarn build
   ```

3. **Connect Wallet**
   The frontend integrates with Web3 wallets (e.g., MetaMask) for transaction signing and blockchain interaction.

## Smart Contract Details

### Batch Payment State Flow
```mermaid
stateDiagram-v2
    [*] --> InputValidation
    InputValidation --> RecipientsValidated: Valid data
    InputValidation --> Error: Invalid data
    Error --> InputValidation: Fix issues

    RecipientsValidated --> WalletConnection: Proceed
    WalletConnection --> NetworkCheck: Connected
    WalletConnection --> Error: No wallet

    NetworkCheck --> BaseNetwork: On Base
    NetworkCheck --> NetworkSwitch: Wrong network
    NetworkSwitch --> BaseNetwork: Switched

    BaseNetwork --> TransactionApproval: Ready
    TransactionApproval --> Signing: Approved
    TransactionApproval --> Cancelled: Rejected

    Signing --> Broadcasting: Signed
    Broadcasting --> Confirming: Submitted
    Confirming --> Success: Confirmed
    Confirming --> Failed: Error

    Success --> [*]: Complete
    Failed --> Retry: Try again
    Retry --> TransactionApproval
    Cancelled --> [*]: Aborted
```

### Gas Optimization Strategy
```mermaid
pie title Gas Savings with Batch Payments
    "Individual Transactions" : 100
    "Batch Transaction Cost" : 25
    "Protocol Fee (0.5%)" : 2
    "Net Savings" : 73
```

### Security Audit Checklist
```mermaid
graph TD
    A[Security Audit] --> B[Contract Logic]
    A --> C[Access Controls]
    A --> D[Input Validation]
    A --> E[Reentrancy Protection]
    A --> F[Overflow Protection]

    B --> B1[Business Logic Correct]
    B --> B2[Payment Distribution Accurate]

    C --> C1[Owner Functions Protected]
    C --> C2[Employee Management Secure]

    D --> D1[Address Validation]
    D --> D2[Amount Validation]
    D --> D3[Array Length Checks]

    E --> E1[ReentrancyGuard Implemented]
    E --> E2[State Changes Before Transfers]

    F --> F1[SafeMath Usage]
    F --> F2[Uint256 Overflow Checks]
```

## Deployment

### Testnet Deployment

Use the provided script for Base testnet deployment:

```bash
forge script script/BaseBatchPayTestnet.s.sol --rpc-url https://goerli.base.org --private-key $PRIVATE_KEY --broadcast --verify
```

### Mainnet Deployment

For production deployment:

```bash
forge script script/BaseBatchPayMainnet.s.sol --rpc-url https://mainnet.base.org --private-key $PRIVATE_KEY --broadcast --verify
```

Ensure sufficient funds for deployment and verification fees.

## Configuration

### Foundry Configuration

The `foundry.toml` file contains project configuration:

```toml
[profile.default]
src = 'src'
out = 'out'
libs = ['lib']

[rpc_endpoints]
base_mainnet = "https://mainnet.base.org"
base_testnet = "https://goerli.base.org"
```

### Network Information

- **Mainnet**: Base Mainnet (Chain ID: 8453)
- **Testnet**: Base Goerli Testnet (Chain ID: 84531)

## Contributing

We welcome contributions to the BatchPay project. Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/your-feature-name`
3. Make your changes and add tests
4. Run the test suite: `forge test`
5. Commit your changes: `git commit -am 'Add new feature'`
6. Push to the branch: `git push origin feature/your-feature-name`
7. Submit a pull request

### Code Standards

- Follow Solidity style guidelines
- Write comprehensive tests for new features
- Ensure all tests pass before submitting
- Update documentation for API changes

## License

This project is licensed under the MIT License. See the LICENSE file for details.

## Support

For questions or support:

- Open an issue on GitHub
- Check the documentation in the `docs/` directory
- Join our community discussions

## Roadmap

Future enhancements may include:

- Multi-token batch payments
- Scheduled batch payments
- Integration with DeFi protocols
- Mobile application development
- Advanced analytics dashboard

## Disclaimer

This software is provided as-is. Users are responsible for understanding the risks associated with blockchain transactions and smart contract interactions. Always test thoroughly on testnets before mainnet deployment.