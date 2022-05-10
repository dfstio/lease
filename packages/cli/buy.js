const EquipmentJSON = require("@lease/contracts/abi/contracts/equipment.sol/Equipment.json");
const publicJSON = require('../../data/buypublic.json');
const proof = require('../../data/buyproof.json');
const {RPC_RINKEBY, BUY_CONTRACT_ADDRESS, KEY_LESSOR } = require('@lease/config');
const ethers = require("ethers");

const tokenId = 0;


main();


async function main()
{
	 console.log('proof:', proof);
	 console.log('public:', publicJSON);

	 
	 const wallet = new ethers.Wallet(KEY_LESSOR);
	 const provider = new ethers.providers.StaticJsonRpcProvider(RPC_RINKEBY);
	 const signer = wallet.connect(provider);
	 const address = ethers.utils.getAddress(wallet.address);
	 const equipment = new ethers.Contract(BUY_CONTRACT_ADDRESS, EquipmentJSON, signer);
	 
	 console.log("Buying the token ", tokenId, "from address", address);

	try {	 		 
	  const tx = await equipment.buy(tokenId,
	  	[proof.pi_a[0], proof.pi_a[1]],
	 	[[proof.pi_b[0][1],proof.pi_b[0][0]],[proof.pi_b[1][1],proof.pi_b[1][0]]],
	 	[proof.pi_c[0],proof.pi_c[1]],
	 	publicJSON
	  
	  );
	  console.log("TX sent: ", tx.hash);
	  const receipt = await tx.wait(1);
	  console.log('Transaction receipt', receipt);
	  
 	} catch (error) {
      console.error("catch", error);
    }

	 
};
