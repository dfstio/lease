const LeaseVerifierABI = require("@lease/contracts/abi/contracts/lease_verifier.sol/LeaseVerifier.json");
const EquipmentABI = require("@lease/contracts/abi/contracts/equipment.sol/Equipment.json");
const publicJSON = require('../../data/leasepublic.json');
const proof = require('../../data/leaseproof.json');
const {RPC_RINKEBY, LEASE_VERIFIER_ADDRESS, BUY_CONTRACT_ADDRESS } = require('@lease/config');
const ethers = require("ethers");
const provider = new ethers.providers.StaticJsonRpcProvider(RPC_RINKEBY);
const verifier = new ethers.Contract(LEASE_VERIFIER_ADDRESS, LeaseVerifierABI, provider);
const equipment = new ethers.Contract(BUY_CONTRACT_ADDRESS, EquipmentABI, provider);
const fs = require('fs').promises;
const { getFromIPFS, addToIPFS } = require("./ipfs");

const equipmentId = 0; // tokenId of Equipment contract


async function main()
{
	 console.log("Verifying lease proof...");

	 const result = await verifier.verifyProof(
	 	[proof.pi_a[0], proof.pi_a[1]],
	 	[[proof.pi_b[0][1],proof.pi_b[0][0]],[proof.pi_b[1][1],proof.pi_b[1][0]]],
	 	[proof.pi_c[0],proof.pi_c[1]],
	 	publicJSON
	 );

	 console.log("Result of verifying: ", result);
	 if( result )
	 {
	 	const priceBI = await equipment.price(equipmentId);
	 	const price = Number(priceBI);
	 	const equipmentUri = await equipment.tokenURI(equipmentId);
	 	const uriHash1 = equipmentUri.replace("https://ipfs.io/ipfs/", "");
	 	const uriHash = uriHash1.replace("http://ipfs.io/ipfs/", "");
        const tokenuriraw = await getFromIPFS(uriHash);
        let uri = JSON.parse(tokenuriraw.toString());
        uri.time = Date.now();
        uri.equipmentId = equipmentId;
        
        
	 	console.log("Equipment price: ", price);
	 	const rating = publicJSON[0]; // Lessee rating
	 	console.log('Lessee rating: ', rating);
	 	const rate = 10 - rating; // Interest rate that Lessor offers;
	 	console.log('Interest rate offered by Lessor: ', rate, "%");
	 	
	 	const years = 5; // 5 years lease
	 	const months = years * 12;
	 	const interest = (price * (rate * 0.01)) * years;
	 	const totalToRepay = price + interest;
	 	const monthlyPaymentFull = totalToRepay/(years*12); // Calculation does not take into account amortization
	 	const monthlyPayment = monthlyPaymentFull.toFixed(0);
	 	console.log('Monthly payment: ', monthlyPayment);
	 	
	 	uri.monthlyPayment = monthlyPayment;
	 	uri.months = months;
	 	uri.description = `**Lease of ${uri.name}**\n\nMonthly payment: *USD ${monthlyPayment}*\n\nTerm of lease: *${months} months*`
	 	const hash = await addToIPFS(JSON.stringify(uri));
		const uripath =  "https://ipfs.io/ipfs/" + hash.path;
	 	
	 	const offer = { equipmentId, monthlyPayment, proof, public: publicJSON, uri: uripath};
	 	console.log('Offer: ', offer);
	 	
	 	await fs.writeFile("../../data/offer.json", JSON.stringify(offer, (_, v) => typeof v === 'bigint' ? v.toString() : v), function (err) {
		   if (err) return console.log(err);
		 });
	 }	 
};


main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });