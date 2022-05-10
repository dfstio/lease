// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

interface ILeaseVerifier {

    function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[4] memory input
        ) external view returns (bool r); 
}

interface IEquipment {

	function ownerOf(uint256 tokenId) external view returns (address owner);

}

contract Lease is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => uint256) public equipmentId; // tokenId of Equipment contract for equipment being leased
    ILeaseVerifier verifier;
    IEquipment equipment;

    constructor(ILeaseVerifier _verifier, IEquipment _equipment) ERC721("Lease", "LEQ") 
    {
    	verifier = _verifier;
    	equipment = _equipment;
    }

    function lease(address to, 
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


    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    	equipmentId[tokenId] = 0;
        super._burn(tokenId);
    }

    function tokenURI(uint256 tokenId)
        public
        view
        override(ERC721, ERC721URIStorage)
        returns (string memory)
    {
        return super.tokenURI(tokenId);
    }

    function supportsInterface(bytes4 interfaceId)
        public
        view
        override(ERC721, ERC721Enumerable)
        returns (bool)
    {
        return super.supportsInterface(interfaceId);
    }
}