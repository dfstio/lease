pragma circom 2.0.0;

include "../../node_modules/circomlib/circuits/comparators.circom";

// Make sure that Lessor has enough money on account to buy from Vendor

template buy () {
 signal input cash;  // cash on account
 signal input price; // Vendor's price
 signal output enough; 
 component compare = GreaterEqThan(16);
 compare.in[0] <== cash;
 compare.in[1] <== price;
 compare.out ==> enough; 
}

component main {public [price]} = buy();
