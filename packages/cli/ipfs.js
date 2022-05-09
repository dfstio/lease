const { INFURA_IPFS_ID, INFURA_IPFS_SECRET, INFURA_IPFS_ENDPOINT } = require('@lease/config');
const contentJSON = require("../../NFT/content.json");
//const { BufferList } = require("bl");
const ipfsClient = require('ipfs-http-client');

const auth =
  'Basic ' + Buffer.from(INFURA_IPFS_ID + ':' + INFURA_IPFS_SECRET).toString('base64');

const ipfs = ipfsClient.create({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
  headers: {
    authorization: auth
  }
});

main();


async function main()
{
	const hash = await addToIPFS(JSON.stringify(contentJSON));
	console.log("Hash: ", hash.path);
	console.log("URL: ", "http://ipfs.io/ipfs/" + hash.path);
};

async function addToIPFS( str )
{
	try {
		const result = await ipfs.add(str, {pin: true});
		return result;
	} catch (error) {
      console.error("catch", error);
    }
};


async function addFileToIPFS(file)
{
try {
      const hash = await ipfs.add(file, {pin: true});
      return hash;
    } catch (error) {
      console.error("catch", error);
    }
};

/*
async function getFromIPFS( hashToGet)
{
	try {
    	const content = new BufferList();
    	for await (const chunk of ipfs.cat(hashToGet)) {
      		content.append(chunk);
    	};
    	return content;
   	} catch (error) {
      console.error("catch", error);
    }
 	
};
*/
