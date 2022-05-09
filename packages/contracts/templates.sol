contract LeaseVerifier {

	mapping (address => mapping(uint256 => uint256)) public roothash; // Lessee address -> time -> roothash register
	
	function writeRootHash(
			   uint256 time,
			   uint256 hash) public
	{
			   roothash[msg.sender][time] = hash;
	}

        require(roothash[address(input[2])][input[3]] == input[1], "wrong roothash"); 

