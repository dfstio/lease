const contentSON = require("../../NFT/content.json");
const EquipmentJSON = require("@lease/contracts/abi/contracts/equipment.sol/LeaseVerifier.json");
const {RPC_RINKEBY, KEY_LESSEE, LEASE_VERIFIER_ADDRESS } = require('@lease/config');
const keccak256 = require('keccak256');
const fs = require('fs');
const ethers = require("ethers");
const newMemEmptyTrie = require("circomlibjs").newMemEmptyTrie;



main();


async function main()
{
	 let tree;
	 tree = await newMemEmptyTrie();
	 
	 const wallet = new ethers.Wallet(KEY_LESSEE);
	 const provider = new ethers.providers.StaticJsonRpcProvider(RPC_RINKEBY);
	 const signer = wallet.connect(provider);
	 const address = ethers.utils.getAddress(wallet.address);
	 const leaseVerifier = new ethers.Contract(LEASE_VERIFIER_ADDRESS, LeaseVerifierJSON, signer);
	 
	 let newJSON = LesseeJSON;
	 const time = Date.now();
	 newJSON.time = time;
	 newJSON.address = address;

	 for(var attributename in newJSON)
	 {
		 console.log(attributename+": "+ newJSON[attributename]);
		 const hash = keccak256(attributename);
		 await tree.insert(hash, newJSON[attributename]);
	 }
	 
	 const root = tree.F.toObject(tree.root);
	 console.log("Calculated roothash: ", root.toString());
	 
	 newJSON.roothash = root;
	 //console.log("NewJSON: ", newJSON);
	 fs.writeFile("../../data/lessee-input.json", JSON.stringify(newJSON, (_, v) => typeof v === 'bigint' ? v.toString() : v), function (err) {
		   if (err) return console.log(err);
		 });
		 
	  const tx = await leaseVerifier.writeRootHash(time, root);
	  console.log("TX sent: ", tx.hash);
	  const receipt = await tx.wait(1);
	  console.log('Transaction receipt', receipt);
	 
	 
};