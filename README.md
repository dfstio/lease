# Lease demo
Lease demo with zero knowledge proofs

## Installation

You need to install node and git. Then install [circom](https://docs.circom.io/getting-started/installation/):

	curl --proto '=https' --tlsv1.2 https://sh.rustup.rs -sSf | sh
	git clone https://github.com/iden3/circom.git
	cargo build --release
	cargo install --path circom
	npm install -g snarkjs

Install [hardhat](https://hardhat.org/getting-started/#installation) that is used for solidity contracts
	
	npm install --save-dev hardhat

and finally clone this repo

	git clone https://github.com/Benjamin-Herald/lease
	cd lease
	yarn

Put config.js file with configuration into packages/config directory using template as example


## Contracts
Contracts are deployed to Rinkeby network. Faucet is located at https://rinkebyfaucet.com/  
Blockchain explorer is located at https://rinkeby.etherscan.io/

Equipment NFT contract tracks equipment owned by Lessors and Vendors. 

Function buy on Equipment contract transfer ownership from Vendor to Lessor checking ZK proof proving that Lessor has
enough money by using BuyVerifier contract:

```
	function buy(
	uint256 tokenId,
	uint[2] memory a,
	uint[2][2] memory b,
	uint[2] memory c,
	uint[2] memory input)
        public
    {
    	require( input[0] == 1, "not enough money to buy"); 
    	require( input[1] == price[tokenId] , "wrong price"); 
    	require( verifier.verifyProof(a, b, c, input) == true, "wrong proof");
    	
    	address tokenOwner = ownerOf(tokenId);
    	safeTransferFrom(tokenOwner, msg.sender, tokenId);
    
    }

```

Lease contract tracks equipment leased by Lessor to Lessee. 

Function lease on this contract creates NFT with lease terms checking ZK proof proving that
- Lessee scoring is correct (using LeaseVerifier ZK contract)
- Lessor owns equipment being leased (using Equipment contract)

```
    function lease(address to, // Lessee address
                   string memory uri, 
                   uint256 _equipmentId,
                   uint[2] memory a,
                   uint[2][2] memory b,
                   uint[2] memory c,
                   uint[4] memory input) public 
	{
    	require( equipment.ownerOf(_equipmentId) == msg.sender, "not a owner of equipment"); 
    	require( verifier.verifyProof(a, b, c, input) == true, "wrong proof");
    	
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        equipmentId[tokenId] = _equipmentId;
    }

```

Equipment deployed to [0x49549aD4872Bb0F487eF8947FcdFCd0Af1479B71](https://rinkeby.etherscan.io/address/0x49549aD4872Bb0F487eF8947FcdFCd0Af1479B71)  
Lease deployed to [0x68DB2cf0E076E3DDBdb66179760Da4a9BB232d33](https://rinkeby.etherscan.io/address/0x68DB2cf0E076E3DDBdb66179760Da4a9BB232d33)

LeaseVerifier deployed to: 	[0xa485e21B76CcF50841db2Cc31813113E26F66ec2](https://rinkeby.etherscan.io/address/0xa485e21B76CcF50841db2Cc31813113E26F66ec2#code)   
BuyVerifier deployed to: 	[0xe96f6f106091E6D4Fb09850bD81687c2ca9562CA](https://rinkeby.etherscan.io/address/0xe96f6f106091E6D4Fb09850bD81687c2ca9562CA#code)  


## Usage with command line tools:

### Purchase of equipment by Lessor from Vendor

Generating ZK proof by Lessor for Vendor proving that Lessor has cash on account enough to buy Equipment
without disclosing amount of cash.
Edit /data/lessor-data.json to input cash on account of Lessor and 
price of equipment set by Vendor and run

	yarn preparebuy

Results will be in the data folder in buyproof.json and buypublic.json, first value in buypublic.json 
is boolean and indicates if cash is enough to buy equipment, second value is the price of equipment.  

To verify ZK proof (both by calling BuyVerifier contract and by using snarkjs command line tool), run  

	yarn verifybuy

To actually transfer NFT from Vendor to Lessor run

	yarn buy
	
To return NFT with equipment from Lessor to Vendor run

	yarn return
	
	

### Lease of equipment owned by Lessor to Lessee

Generating ZK proof with credit rating by Lessee for Lessor
Edit /data/lessee-data.json to input data of Lessee and run

	yarn preparelease

Results will be in the data folder in leaseproof.json and leasepublic.json, first value in leasepublic.json 
is Lessee's credit rating, second value is the roothash of SMT of Lessee's data from lessee-data.json, third is 
Lessee's Ethereum address and fourth is time

To verify ZK proof, run  

	yarn verifylease
	
To make offer from Lessor to Lessee taking into account rating of Lessee, run

	yarn offer	
	
The result of the offer will be in data/offer.json

To accept the offer and mint NFT on Lease contract, run

	yarn accept
	
There will be minted NFT like https://testnets.opensea.io/assets/0x68db2cf0e076e3ddbdb66179760da4a9bb232d33/0	


## NFT

Using as example Ultrasonido LOGIQ P9 (USD 19000)

https://xrgmed.com.mx/producto/logic-p9/

https://www.ultrasoundsupply.com/products/ultrasound-machines/ge-ultrasound/ge-logiq-p9/

Equipment NFTs: https://testnets.opensea.io/collection/equipment-9w1atiw3ed  

Lease NFT: https://testnets.opensea.io/assets/0x68db2cf0e076e3ddbdb66179760da4a9bb232d33/0


## TODO
- NFT and IPFS creation cli

