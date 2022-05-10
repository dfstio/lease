const { INFURA_IPFS_ID, INFURA_IPFS_SECRET, INFURA_IPFS_ENDPOINT, INFURA_IPFS_PORT } = require('@lease/config');
const ipfsClient = require('ipfs-http-client');
const { BufferList } = require("bl");

const auth = 'Basic ' + Buffer.from(INFURA_IPFS_ID + ':' + INFURA_IPFS_SECRET).toString('base64');

const ipfs = ipfsClient.create({
  host: INFURA_IPFS_ENDPOINT,
  port: INFURA_IPFS_PORT,
  protocol: 'https',
  headers: {
    authorization: auth
  }
});


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


async function getFromIPFS( hashToGet)
{
	console.log("Getting data from IPFS hash", hashToGet);
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

module.exports = {
    getFromIPFS,
    addToIPFS,
    addFileToIPFS,
}