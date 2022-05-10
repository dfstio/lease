const EquipmentABI = require("@lease/contracts/abi/contracts/equipment.sol/Equipment.json");
const {RPC_RINKEBY, BUY_CONTRACT_ADDRESS, KEY_LESSOR, KEY_VENDOR } = require('@lease/config');
const ethers = require("ethers");

const tokenId = 0;

async function main()
{	 
	 const wallet = new ethers.Wallet(KEY_LESSOR);
	 const provider = new ethers.providers.StaticJsonRpcProvider(RPC_RINKEBY);
	 const signer = wallet.connect(provider);
	 const lessor = ethers.utils.getAddress(wallet.address);
	 const equipment = new ethers.Contract(BUY_CONTRACT_ADDRESS, EquipmentABI, signer);
	 
	 const walletVendor = new ethers.Wallet(KEY_VENDOR);
	 const vendor = ethers.utils.getAddress(walletVendor.address);
	 
	 console.log("Transferring the token ", tokenId, "from lessor", lessor, "to vendor", vendor);

	try {	 	
	  const owner = await equipment.ownerOf(tokenId);	 
	  console.log("Token owner is", owner);
	  const tx = await equipment["safeTransferFrom(address,address,uint256)"](lessor, vendor, tokenId);
	  console.log("TX sent: ", tx.hash);
	  const receipt = await tx.wait(1);
	  console.log('Transaction receipt', receipt);
	  
 	} catch (error) {
      console.error("catch", error);
    }

	 
};

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });