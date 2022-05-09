# Lease demo
Lease demo with zero knowledge proofs

## Configuration

	git clone https://github.com/Benjamin-Herald/lease

Put config.js file with configuration into packages/config directory using template as example


Run yarn from list directory

In case you plan to change circuit, install circom using 
https://docs.circom.io/getting-started/installation/

## Contracts
Contracts are deployed to Rinkeby network. Faucet is located at https://rinkebyfaucet.com/
Blockchain explorer is located at https://rinkeby.etherscan.io/

LeaseVerifier deployed to: 	0xa485e21B76CcF50841db2Cc31813113E26F66ec2
ButVerifier deployed to: 	[0xe96f6f106091E6D4Fb09850bD81687c2ca9562CA](https://rinkeby.etherscan.io/address/0xe96f6f106091E6D4Fb09850bD81687c2ca9562CA#code)

## Usage:

### Generating ZK proof by Lessor for Vendor
Edit /data/lessor-data.json to input cash on account of Lessor and 
price of equipment set by Vendor and run

	yarn buy

Results will be in the data folder in buyproof.json and buypublic.json, first value in buypublic.json 
is boolean and indicates if cash is enough to buy equipment, second value is the price of equipment

### Generating ZK proof with credit rating by Lessee for Lessor
Edit /data/lessee-data.json to input data of Lessee and run

	yarn lease

Results will be in the data folder in leaseproof.json and leasepublic.json, first value in leasepublic.json 
is Lessee's credit rating, second value is the roothash of SMT of Lessee's data from lessee-data.json, third is 
Lessee's Ethereum address and fourth is time


## NFT

Using as example https://xrgmed.com.mx/producto/logic-p9/
https://www.ultrasoundsupply.com/products/ultrasound-machines/ge-ultrasound/ge-logiq-p9/ - USD 19000

## TODO
