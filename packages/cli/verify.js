const LeaseVerifierJSON = require("@lease/contracts/abi/contracts/lease_verifier.sol/LeaseVerifier.json");
const publicJSON = require('../../data/leasepublic.json');
const proof = require('../../data/leaseproof.json');
const {RPC_RINKEBY, LEASE_VERIFIER_ADDRESS } = require('@lease/config');
const ethers = require("ethers");
const provider = new ethers.providers.StaticJsonRpcProvider(RPC_RINKEBY);
const verifier = new ethers.Contract(LEASE_VERIFIER_ADDRESS, LeaseVerifierJSON, provider);
const util = require('util')
const exec = util.promisify(require('child_process').exec)



main();


async function main()
{
	 console.log('proof:', proof);
	 console.log('public:', publicJSON);
	 console.log("Verifying lease proof...");

	 
	 const result = await verifier.verifyProof(
	 	[proof.pi_a[0], proof.pi_a[1]],
	 	[[proof.pi_b[0][1],proof.pi_b[0][0]],[proof.pi_b[1][1],proof.pi_b[1][0]]],
	 	[proof.pi_c[0],proof.pi_c[1]],
	 	publicJSON
	 );


	 console.log("Result of contract call: ", result);
	 
	 let out = 'snarkjs cli call failed';
	 try {
      	out = await exec(`snarkjs g16v ../circuit/lease_verification_key.json ../../data/leasepublic.json ../../data/leaseproof.json`);
      	console.log("Result of snarkjs cli call: ", out.stdout.toString());
    } catch (e) {
      console.log(out, e)
      throw e
    }

	 
	 
};
