// function: transfer 0 matic to yourself with prc-20 text
// prepartion: npm install web3 && npm install ethereumjs-util
// how to run:: node prc20.js your-privatekey num
// then,this script will send num times
// note: remember to set a suitable gasPrice

const { Web3 } = require('web3');
const ethUtil = require('ethereumjs-util');

// Access command-line arguments
const args = process.argv.slice(2);
console.log('privateKey:', args);
console.log('transaction num:', args);

// Use the arguments as needed
const privateKey = args[0];
const maxAttempts = args[1];

const gasPrice = '356805269843'; // Replace with your desired gas price
const gasLimit = 22024; // This is the standard gas limit for a simple ETH transfer


// Additional data to include in the transaction
const sendTransaction = async (privateKey, maxAttempts) => {
  // get address by privatekey
  const privateKeyBuffer = Buffer.from(privateKey, 'hex');
  const address = ethUtil.privateToAddress(privateKeyBuffer).toString('hex');
  console.log('Address:', address);
  const fromAddress = '0x'+address; 
  const toAddress = '0x'+address; 

  const additionalData = '0x' + Buffer.from(JSON.stringify({"p":"prc-20","op":"mint","tick":"pols","amt":"100000000"})).toString('hex');
  const web3 = new Web3('https://rpc-mainnet.maticvigil.com/'); // Use the appropriate RPC endpoint
  for (let attempts = 0; attempts < maxAttempts; attempts++) {
    const nonce = await web3.eth.getTransactionCount(fromAddress);
    const transactionObject = {
      from: fromAddress,
      to: toAddress,
      value: web3.utils.toWei('0.01', 'ether'), // Replace with the amount you want to send
      gasPrice: gasPrice,
      gas: gasLimit,
      nonce: nonce,
      data:additionalData,
    };
    const signedTransaction = await web3.eth.accounts.signTransaction(transactionObject, privateKey);

    const res = web3.eth.sendSignedTransaction(signedTransaction.rawTransaction).once('transactionHash', (hash) => {
      console.log(`Transaction Hash: ${hash}`);
    })
    console.log(res);
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
