// function: transfer 0 matic to yourself with prc-20 text
// prepartion: npm install web3 && npm install ethereumjs-util
// how to run:: node prc20.js your-privatekey num
// then,this script will send num times
// note: remember to set a suitable gasPrice

const { Web3 } = require('web3');
const ethUtil = require('ethereumjs-util');
const { ethers } = require('ethers');

// Access command-line arguments
const args = process.argv.slice(2);
console.log('privateKey:', args);
console.log('transaction num:', args);

// Use the arguments as needed
const privateKey = args[0];
const maxAttempts = args[1];
const provider = new ethers.JsonRpcProvider('https://rpc-mainnet.matic.quiknode.pro');

const sendTransaction = async (privateKey, maxAttempts) => {
  // get address by privatekey
  const privateKeyBuffer = Buffer.from(privateKey, 'hex');
  const addr = ethUtil.privateToAddress(privateKeyBuffer).toString('hex');
  const address = '0x'+addr; 
  console.log('Address:', address);
  const fromAddress = address;
  const toAddress = address; 

  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    let nonce = await provider.getTransactionCount(fromAddress);
    console.log("get nonce:",nonce);
    let feeData = await provider.getFeeData();
    console.log("get feeData:",feeData);

    const transactionObject = {
      type: 2,
      from: fromAddress,
      to: toAddress,
      value: ethers.parseEther("0.00"), 
      gasLimit: 22024,
      maxPriorityFeePerGas: feeData["maxPriorityFeePerGas"], 
      maxFeePerGas: feeData["maxFeePerGas"], 
      nonce: nonce,
      data: Web3.utils.asciiToHex('data:,{"p":"prc-20","op":"mint","tick":"pols","amt":"100000000"}'),

    };

    const signer = new ethers.Wallet(privateKey, provider);
    const tx = await signer.sendTransaction(transactionObject);
    console.log(tx);

    console.log(`Transaction num: ${attempts}.`);
    console.log('Sleep for 10 seconds');
    await sleep(10000); 
  }    
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// Call the function with the provided parameters
sendTransaction(privateKey, maxAttempts);
