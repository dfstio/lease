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
Edit /packages/circuit/inputbuy.json to input cash on account of Lessor and 
price of equipment set by Vendor and run

	yarn buy

Results will be in proof.json and public.json in packages/circuit, first value in public.json 
is boolean and indicates is cash is enough to buy equipment, second value is price of equipment

## Command line tools



## TODO
