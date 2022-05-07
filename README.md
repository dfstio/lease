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
is Lessee's credit rating, second value is the roothash of SMT of Lessee's data from lessee-data.json




## TODO
