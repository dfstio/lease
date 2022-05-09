const BuyVerifierJSON = require("@lease/contracts/abi/contracts/buy_verifier.sol/BuyVerifier.json");
const publicJSON = require('../../data/buypublic.json');
const proof = require('../../data/buyproof.json');
const {RPC_RINKEBY, BUY_VERIFIER_ADDRESS } = require('@lease/config');
const ethers = require("ethers");
const provider = new ethers.providers.StaticJsonRpcProvider(RPC_RINKEBY);
const verifier = new ethers.Contract(BUY_VERIFIER_ADDRESS, BuyVerifierJSON, provider);
const util = require('util')
const exec = util.promisify(require('child_process').exec)



main();


async function main()
{
	 console.log('proof:', proof);
	 console.log('public:', publicJSON);
	 console.log("Verifying buy proof...");

	 
	 const result = await verifier.verifyProof(
	 	[proof.pi_a[0], proof.pi_a[1]],
	 	[[proof.pi_b[0][1],proof.pi_b[0][0]],[proof.pi_b[1][1],proof.pi_b[1][0]]],
	 	[proof.pi_c[0],proof.pi_c[1]],
	 	publicJSON
	 );


	 console.log("Result of contract call: ", result);
	 
	 let out = 'snarkjs cli call failed';
	 try {
      	out = await exec(`snarkjs g16v ../circuit/buy_verification_key.json ../../data/buypublic.json ../../data/buyproof.json`);
      	console.log("Result of snarkjs cli call: ", out.stdout.toString());
    } catch (e) {
      console.log(out, e)
      throw e
    }

	 
	 
};
