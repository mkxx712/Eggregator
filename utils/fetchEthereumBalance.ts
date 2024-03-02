const { Web3 } = require("web3");
const infura_api = process.env.INFURA_API
const web3 = new Web3(
  new Web3.providers.HttpProvider(
    "https://mainnet.infura.io/v3/" + infura_api,
  ),
);

const balanceOfABI = [
  {
    constant: true,
    inputs: [
      {
        name: "_owner",
        type: "address",
      },
    ],
    name: "balanceOf",
    outputs: [
      {
        name: "balance",
        type: "uint256",
      },
    ],
    payable: false,
    stateMutability: "view",
    type: "function",
  },
];


const DAI_Contract = "0x6B175474E89094C44Da98b954EedeAC495271d0F";
const USDT_Contract = "0xdac17f958d2ee523a2206206994597c13d831ec7";
const USDC_Contract = "0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48";
const UNI_Contract = "0x1f9840a85d5af5bf1d1762f925bdaddc4201f984";

const tokenHolder = process.env.ETH_ADD;


const DAI = new web3.eth.Contract(balanceOfABI, DAI_Contract);
const USDT = new web3.eth.Contract(balanceOfABI, USDT_Contract);
const USDC = new web3.eth.Contract(balanceOfABI, USDC_Contract);
const UNI = new web3.eth.Contract(balanceOfABI, UNI_Contract);


export async function getEthereumBalance() {

  const DAI_result = await DAI.methods.balanceOf(tokenHolder).call();
  const DAI_formattedResult = web3.utils.fromWei(DAI_result, "ether");
  const USDT_result = await USDT.methods.balanceOf(tokenHolder).call();
  const USDT_formattedResult = web3.utils.fromWei(USDT_result, "ether");
  const USDC_result = await USDC.methods.balanceOf(tokenHolder).call();
  const USDC_formattedResult = web3.utils.fromWei(USDC_result, "ether");
  const UNI_result = await UNI.methods.balanceOf(tokenHolder).call();
  const UNI_formattedResult = web3.utils.fromWei(UNI_result, "ether");
  return [{'assets':'DAI', 'amount': DAI_formattedResult}, {'assets':'USDT', 'amount': USDT_formattedResult}, {'assets':'USDC', 'amount':USDC_formattedResult}, {'assets':'UNI', 'amount': UNI_formattedResult}];
}
