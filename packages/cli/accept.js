const LeaseABI = require("@lease/contracts/abi/contracts/lease.sol/Lease.json");
const offer = require('../../data/offer.json');
const {RPC_RINKEBY, LEASE_CONTRACT_ADDRESS, KEY_LESSOR, KEY_LESSEE} = require('@lease/config');
const ethers = require("ethers");


async function main()
{
	 console.log("Accepting offer and creating Lease NFT...");

	 const wallet = new ethers.Wallet(KEY_LESSOR);
	 const provider = new ethers.providers.StaticJsonRpcProvider(RPC_RINKEBY);
	 const signer = wallet.connect(provider);
	 const address = ethers.utils.getAddress(wallet.address);
	 const lease = new ethers.Contract(LEASE_CONTRACT_ADDRESS, LeaseABI, signer);
	 
	 const lesseeWallet = new ethers.Wallet(KEY_LESSEE);
	 const lessee = ethers.utils.getAddress(lesseeWallet.address);
	 const proof = offer.proof;

	 const tx = await lease.lease(
	 		lessee,
	 		offer.uri,
	 		offer.equipmentId,
	 		[proof.pi_a[0], proof.pi_a[1]],
	 		[[proof.pi_b[0][1],proof.pi_b[0][0]],[proof.pi_b[1][1],proof.pi_b[1][0]]],
	 		[proof.pi_c[0],proof.pi_c[1]],
	 		offer.public
	 	);
	 
	 console.log("TX sent: ", tx.hash);
	 const receipt = await tx.wait(1);
	 console.log('Transaction receipt', receipt);
};


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });