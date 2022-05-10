const { INFURA_IPFS_ID, INFURA_IPFS_SECRET, INFURA_IPFS_ENDPOINT, INFURA_IPFS_PORT } = require('@lease/config');
const contentJSON = require("../../NFT/content.json");
const { addToIPFS } = require("./ipfs");


main();


async function main()
{
	const hash = await addToIPFS(JSON.stringify(contentJSON));
	console.log("Hash: ", hash.path);
	console.log("URL: ", "https://ipfs.io/ipfs/" + hash.path);
};

