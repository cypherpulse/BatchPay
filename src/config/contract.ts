export const BATCH_PAY_ADDRESS = '0x37957E2e29E79D1A4e66c6DB00bC751927a75fD4' as const;

export const BATCH_PAY_ABI = [
  {"type":"constructor","inputs":[{"name":"_treasury","type":"address","internalType":"address"}],"stateMutability":"nonpayable"},
  {"type":"function","name":"FEE_BPS","inputs":[],"outputs":[{"name":"","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"TREASURY","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},
  {"type":"function","name":"addEmployee","inputs":[{"name":"emp","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"function","name":"batchPay","inputs":[{"name":"recipients","type":"address[]","internalType":"address[]"},{"name":"amounts","type":"uint256[]","internalType":"uint256[]"},{"name":"names","type":"string[]","internalType":"string[]"}],"outputs":[],"stateMutability":"payable"},
  {"type":"function","name":"employees","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},
  {"type":"function","name":"getPaymentHistory","inputs":[{"name":"payer","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"tuple[]","internalType":"struct BaseBatchPay.Batch[]","components":[{"name":"recipients","type":"address[]","internalType":"address[]"},{"name":"amounts","type":"uint256[]","internalType":"uint256[]"},{"name":"names","type":"string[]","internalType":"string[]"},{"name":"timestamp","type":"uint256","internalType":"uint256"}]}],"stateMutability":"view"},
  {"type":"function","name":"isEmployee","inputs":[{"name":"emp","type":"address","internalType":"address"}],"outputs":[{"name":"","type":"bool","internalType":"bool"}],"stateMutability":"view"},
  {"type":"function","name":"owner","inputs":[],"outputs":[{"name":"","type":"address","internalType":"address"}],"stateMutability":"view"},
  {"type":"function","name":"paymentHistory","inputs":[{"name":"","type":"address","internalType":"address"},{"name":"","type":"uint256","internalType":"uint256"}],"outputs":[{"name":"timestamp","type":"uint256","internalType":"uint256"}],"stateMutability":"view"},
  {"type":"function","name":"removeEmployee","inputs":[{"name":"emp","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"function","name":"renounceOwnership","inputs":[],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"function","name":"transferOwnership","inputs":[{"name":"newOwner","type":"address","internalType":"address"}],"outputs":[],"stateMutability":"nonpayable"},
  {"type":"event","name":"BatchPaid","inputs":[{"name":"payer","type":"address","indexed":true,"internalType":"address"},{"name":"recipients","type":"address[]","indexed":false,"internalType":"address[]"},{"name":"amounts","type":"uint256[]","indexed":false,"internalType":"uint256[]"},{"name":"names","type":"string[]","indexed":false,"internalType":"string[]"},{"name":"fee","type":"uint256","indexed":false,"internalType":"uint256"}],"anonymous":false},
  {"type":"event","name":"EmployeeAdded","inputs":[{"name":"payer","type":"address","indexed":true,"internalType":"address"},{"name":"employee","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},
  {"type":"event","name":"EmployeeRemoved","inputs":[{"name":"payer","type":"address","indexed":true,"internalType":"address"},{"name":"employee","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},
  {"type":"event","name":"OwnershipTransferred","inputs":[{"name":"previousOwner","type":"address","indexed":true,"internalType":"address"},{"name":"newOwner","type":"address","indexed":true,"internalType":"address"}],"anonymous":false},
  {"type":"error","name":"OwnableInvalidOwner","inputs":[{"name":"owner","type":"address","internalType":"address"}]},
  {"type":"error","name":"OwnableUnauthorizedAccount","inputs":[{"name":"account","type":"address","internalType":"address"}]},
  {"type":"error","name":"ReentrancyGuardReentrantCall","inputs":[]}
] as const;

export const FEE_BPS = 50; // 0.5%
export const MAX_RECIPIENTS = 200;
