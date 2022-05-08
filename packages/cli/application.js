const LesseeJSON = require("../../data/lessee-data.json");
const keccak256 = require('keccak256');
const fs = require('fs');
const newMemEmptyTrie = require("circomlibjs").newMemEmptyTrie;


main();


async function main()
{
	 let tree;
	 tree = await newMemEmptyTrie();

	 for(var attributename in LesseeJSON)
	 {
		 console.log(attributename+": "+LesseeJSON[attributename]);
		 const hash = keccak256(attributename);
		 await tree.insert(hash, LesseeJSON[attributename]);
	 }
	 const root = tree.F.toObject(tree.root);
	 console.log("Calculated roothash: ", root.toString());
	 let newJSON = LesseeJSON;
	 newJSON.roothash = root;
	 //console.log("NewJSON: ", newJSON);
	 fs.writeFile("../../data/lessee-input.json", JSON.stringify(newJSON, (_, v) => typeof v === 'bigint' ? v.toString() : v), function (err) {
		   if (err) return console.log(err);
		 });
	 
	 
};