// SPDX-License-Identifier: MIT
pragma solidity ^0.8.4;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Enumerable.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721Burnable.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract BuyVerifier {

    function verifyProof(
            uint[2] memory a,
            uint[2][2] memory b,
            uint[2] memory c,
            uint[2] memory input
        ) public view returns (bool r) {}


}

contract Equipment is ERC721, ERC721Enumerable, ERC721URIStorage, ERC721Burnable, Ownable {
    using Counters for Counters.Counter;

    Counters.Counter private _tokenIdCounter;
    mapping(uint256 => uint256) public price;
    BuyVerifier verifier;

    constructor(BuyVerifier _verifier) ERC721("Equipment", "EQP") 
    {
    	verifier = _verifier;
    }

    function safeMint(address to, string memory uri, uint256 _price) public {
        uint256 tokenId = _tokenIdCounter.current();
        _tokenIdCounter.increment();
        _safeMint(to, tokenId);
        _setTokenURI(tokenId, uri);
        price[tokenId] = _price;
    }

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

    // The following functions are overrides required by Solidity.

    function _beforeTokenTransfer(address from, address to, uint256 tokenId)
        internal
        override(ERC721, ERC721Enumerable)
    {
        super._beforeTokenTransfer(from, to, tokenId);
    }

    function _burn(uint256 tokenId) internal override(ERC721, ERC721URIStorage) {
    	price[tokenId] = 0;
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